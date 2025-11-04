import { inngest } from "./client";
import { db } from "@/lib/prisma";
import EmailTemplate from "@/emails/template";
import { sendEmail } from "@/actions/send-email";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const processRecurringTransaction = inngest.createFunction(
  {
    id: "process-recurring-transaction",
    name: "Process Recurring Transaction",
    throttle: {
      limit: 10,
      period: "1m",
      key: "event.data.userId",
    },
  },
  { event: "transaction.recurring.process" },
  async ({ event, step }) => {
    if (!event?.data?.transactionId || !event?.data?.userId) {
      console.error("Invalid event data:", event);
      return { error: "Missing required event data" };
    }

    await step.run("process-transaction", async () => {
      const transaction = await db.transaction.findUnique({
        where: {
          id: event.data.transactionId,
          userId: event.data.userId,
        },
        include: {
          account: true,
        },
      });

      if (!transaction || !isTransactionDue(transaction)) return;

      await db.$transaction(async (tx) => {
        await tx.transaction.create({
          data: {
            type: transaction.type,
            amount: transaction.amount,
            description: `${transaction.description} (Recurring)`,
            date: new Date(),
            category: transaction.category,
            userId: transaction.userId,
            accountId: transaction.accountId,
            isRecurring: false,
          },
        });

        const balanceChange =
          transaction.type === "EXPENSE"
            ? -transaction.amount.toNumber()
            : transaction.amount.toNumber();

        await tx.account.update({
          where: { id: transaction.accountId },
          data: { balance: { increment: balanceChange } },
        });

        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            lastProcessed: new Date(),
            nextRecurringDate: calculateNextRecurringDate(
              new Date(),
              transaction.recurringInterval
            ),
          },
        });
      });
    });
  }
);

export const triggerRecurringTransactions = inngest.createFunction(
  {
    id: "trigger-recurring-transactions",
    name: "Trigger Recurring Transactions",
  },
  { cron: "0 0 * * *" },
  async ({ step }) => {
    const recurringTransactions = await step.run(
      "fetch-recurring-transactions",
      async () => {
        return await db.transaction.findMany({
          where: {
            isRecurring: true,
            status: "COMPLETED",
            OR: [
              { lastProcessed: null },
              {
                nextRecurringDate: {
                  lte: new Date(),
                },
              },
            ],
          },
        });
      }
    );

    if (recurringTransactions.length > 0) {
      const events = recurringTransactions.map((transaction) => ({
        name: "transaction.recurring.process",
        data: {
          transactionId: transaction.id,
          userId: transaction.userId,
        },
      }));

      await inngest.send(events);
    }

    return { triggered: recurringTransactions.length };
  }
);

// FIXED: Enhanced AI insights generation with better error handling and logging
async function generateFinancialInsights(stats, month, userId) {
  // Validation: Check if we have meaningful data
  if (!stats || (stats.totalIncome === 0 && stats.totalExpenses === 0)) {
    console.log(`[AI Insights] No financial data for user ${userId} in ${month}`);
    return [
      "Start tracking your expenses to get personalized insights.",
      "Add your first transaction to see AI-powered recommendations.",
      "Set up a budget to track your financial goals.",
    ];
  }

  // Check if API key exists
  if (!process.env.GEMINI_API_KEY) {
    console.error("[AI Insights] GEMINI_API_KEY is not set");
    return getDefaultInsights(stats);
  }

  try {
    console.log(`[AI Insights] Generating insights for user ${userId}, month: ${month}`);
    console.log(`[AI Insights] Stats:`, JSON.stringify(stats, null, 2));

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // FIXED: Use the correct model name that's available in your API
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    });

    // Enhanced prompt with better structure
    const prompt = `You are a financial advisor analyzing monthly expenses. Provide exactly 3 actionable insights based on this data.

Financial Summary for ${month}:
- Total Income: $${stats.totalIncome.toFixed(2)}
- Total Expenses: $${stats.totalExpenses.toFixed(2)}
- Net Savings: $${(stats.totalIncome - stats.totalExpenses).toFixed(2)}
- Number of Transactions: ${stats.transactionCount}

Expense Breakdown by Category:
${Object.entries(stats.byCategory)
        .sort(([, a], [, b]) => b - a)
        .map(([category, amount]) => `  • ${category}: $${amount.toFixed(2)} (${((amount / stats.totalExpenses) * 100).toFixed(1)}%)`)
        .join('\n')}

Provide 3 specific, actionable insights. Each insight should:
1. Be one clear sentence
2. Include specific numbers from the data
3. Provide actionable advice

Return ONLY a valid JSON array with exactly 3 strings. Example format:
["Your food expenses of $500 are 30% of your budget - consider meal planning to save $100/month", "Great job! You saved $200 this month, which is 20% of your income", "Your entertainment spending increased by $50 - try setting a monthly limit of $150"]

Return ONLY the JSON array, no other text.`;

    console.log("[AI Insights] Sending request to Gemini API...");

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    console.log("[AI Insights] Raw API response:", text);

    // Clean and parse the response
    let cleanedText = text.trim();

    // Remove markdown code blocks if present
    cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');

    // Try to extract JSON array
    const jsonMatch = cleanedText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error("[AI Insights] No JSON array found in response:", cleanedText);
      return getDefaultInsights(stats);
    }

    const insights = JSON.parse(jsonMatch[0]);

    // Validate insights
    if (!Array.isArray(insights) || insights.length !== 3) {
      console.error("[AI Insights] Invalid insights format:", insights);
      return getDefaultInsights(stats);
    }

    // Ensure all insights are strings
    const validInsights = insights
      .filter(insight => typeof insight === 'string' && insight.length > 0)
      .slice(0, 3);

    if (validInsights.length !== 3) {
      console.error("[AI Insights] Not enough valid insights:", validInsights);
      return getDefaultInsights(stats);
    }

    console.log("[AI Insights] Successfully generated insights:", validInsights);
    return validInsights;

  } catch (error) {
    console.error("[AI Insights] Error generating insights:", error);
    console.error("[AI Insights] Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    return getDefaultInsights(stats);
  }
}

// Helper function to generate meaningful default insights based on actual data
function getDefaultInsights(stats) {
  const insights = [];

  if (stats.totalExpenses > stats.totalIncome) {
    insights.push(`⚠️ You spent $${(stats.totalExpenses - stats.totalIncome).toFixed(2)} more than you earned this month. Consider reviewing your expenses.`);
  } else if (stats.totalIncome > stats.totalExpenses) {
    const saved = stats.totalIncome - stats.totalExpenses;
    insights.push(`💰 Great job! You saved $${saved.toFixed(2)} this month, which is ${((saved / stats.totalIncome) * 100).toFixed(1)}% of your income.`);
  }

  // Find highest expense category
  if (Object.keys(stats.byCategory).length > 0) {
    const [highestCategory, highestAmount] = Object.entries(stats.byCategory)
      .sort(([, a], [, b]) => b - a)[0];
    const percentage = ((highestAmount / stats.totalExpenses) * 100).toFixed(1);
    insights.push(`📊 Your highest expense category is ${highestCategory} at $${highestAmount.toFixed(2)} (${percentage}% of total expenses).`);
  }

  // Add transaction count insight
  insights.push(`📝 You made ${stats.transactionCount} transactions this month. Consistent tracking helps identify spending patterns.`);

  // Ensure we always return 3 insights
  while (insights.length < 3) {
    insights.push("💡 Continue tracking your expenses to get more personalized insights next month.");
  }

  return insights.slice(0, 3);
}

export const generateMonthlyReports = inngest.createFunction(
  {
    id: "generate-monthly-reports",
    name: "Generate Monthly Reports",
  },
  { cron: "0 0 1 * *" },
  async ({ step }) => {
    const users = await step.run("fetch-users", async () => {
      return await db.user.findMany({
        include: { accounts: true },
      });
    });

    let successCount = 0;
    let errorCount = 0;

    for (const user of users) {
      try {
        await step.run(`generate-report-${user.id}`, async () => {
          console.log(`[Monthly Report] Processing user: ${user.id} (${user.email})`);

          const lastMonth = new Date();
          lastMonth.setMonth(lastMonth.getMonth() - 1);

          const stats = await getMonthlyStats(user.id, lastMonth);
          const monthName = lastMonth.toLocaleString("default", {
            month: "long",
            year: "numeric"
          });

          console.log(`[Monthly Report] Stats for ${user.email}:`, stats);

          // Generate AI insights with user ID for better logging
          const insights = await generateFinancialInsights(stats, monthName, user.id);

          console.log(`[Monthly Report] Generated insights for ${user.email}:`, insights);

          // Send email with insights
          await sendEmail({
            to: user.email,
            subject: `Your Monthly Financial Report - ${monthName}`,
            react: EmailTemplate({
              userName: user.name,
              type: "monthly-report",
              data: {
                stats,
                month: monthName,
                insights,
              },
            }),
          });

          console.log(`[Monthly Report] Email sent successfully to ${user.email}`);
          successCount++;
        });
      } catch (error) {
        console.error(`[Monthly Report] Error processing user ${user.id}:`, error);
        errorCount++;
      }
    }

    console.log(`[Monthly Report] Summary: ${successCount} successful, ${errorCount} errors`);
    return {
      processed: users.length,
      successful: successCount,
      errors: errorCount
    };
  }
);

export const checkBudgetAlerts = inngest.createFunction(
  { name: "Check Budget Alerts" },
  { cron: "0 */6 * * *" },
  async ({ step }) => {
    const budgets = await step.run("fetch-budgets", async () => {
      return await db.budget.findMany({
        include: {
          user: {
            include: {
              accounts: {
                where: {
                  isDefault: true,
                },
              },
            },
          },
        },
      });
    });

    for (const budget of budgets) {
      const defaultAccount = budget.user.accounts[0];
      if (!defaultAccount) continue;

      await step.run(`check-budget-${budget.id}`, async () => {
        const startDate = new Date();
        startDate.setDate(1);

        const expenses = await db.transaction.aggregate({
          where: {
            userId: budget.userId,
            accountId: defaultAccount.id,
            type: "EXPENSE",
            date: {
              gte: startDate,
            },
          },
          _sum: {
            amount: true,
          },
        });

        const totalExpenses = expenses._sum.amount?.toNumber() || 0;
        const budgetAmount = budget.amount;
        const percentageUsed = (totalExpenses / budgetAmount) * 100;

        if (
          percentageUsed >= 80 &&
          (!budget.lastAlertSent ||
            isNewMonth(new Date(budget.lastAlertSent), new Date()))
        ) {
          await sendEmail({
            to: budget.user.email,
            subject: `Budget Alert for ${defaultAccount.name}`,
            react: EmailTemplate({
              userName: budget.user.name,
              type: "budget-alert",
              data: {
                percentageUsed: percentageUsed.toFixed(1),
                budgetAmount: budgetAmount.toFixed(2),
                totalExpenses: totalExpenses.toFixed(2),
                accountName: defaultAccount.name,
              },
            }),
          });

          await db.budget.update({
            where: { id: budget.id },
            data: { lastAlertSent: new Date() },
          });
        }
      });
    }
  }
);

function isNewMonth(lastAlertDate, currentDate) {
  return (
    lastAlertDate.getMonth() !== currentDate.getMonth() ||
    lastAlertDate.getFullYear() !== currentDate.getFullYear()
  );
}

function isTransactionDue(transaction) {
  if (!transaction.lastProcessed) return true;
  const today = new Date();
  const nextDue = new Date(transaction.nextRecurringDate);
  return nextDue <= today;
}

function calculateNextRecurringDate(date, interval) {
  const next = new Date(date);
  switch (interval) {
    case "DAILY":
      next.setDate(next.getDate() + 1);
      break;
    case "WEEKLY":
      next.setDate(next.getDate() + 7);
      break;
    case "MONTHLY":
      next.setMonth(next.getMonth() + 1);
      break;
    case "YEARLY":
      next.setFullYear(next.getFullYear() + 1);
      break;
  }
  return next;
}

async function getMonthlyStats(userId, month) {
  const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
  const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);

  const transactions = await db.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  return transactions.reduce(
    (stats, t) => {
      const amount = t.amount.toNumber();
      if (t.type === "EXPENSE") {
        stats.totalExpenses += amount;
        stats.byCategory[t.category] =
          (stats.byCategory[t.category] || 0) + amount;
      } else {
        stats.totalIncome += amount;
      }
      return stats;
    },
    {
      totalExpenses: 0,
      totalIncome: 0,
      byCategory: {},
      transactionCount: transactions.length,
    }
  );
}
