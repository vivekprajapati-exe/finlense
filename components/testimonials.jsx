import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Atreya Gosavi",
    role: "B.Tech Aspirant at VIT",
    content:
      "As a student managing limited pocket money, this app helped me track every expense. The AI reminders make sure I never overspend before the month ends.",
    rating: 4,
  },
  {
    name: "Tanush Karpe",
    role: "Small Business Owner",
    content:
      "Running a business means every rupee counts. This app helps me monitor cash flow and categorize expenses effortlessly—like having a smart accountant in my pocket.",
    rating: 5,
  },
  {
    name: "Priyanka Dalvi",
    role: "Electro-Plating Analyst",
    content:
      "My job demands precision, and this app matches that. The AI’s insights on spending patterns are detailed and accurate, helping me plan better for monthly expenses.",
    rating: 4,
  },
]

export function Testimonials() {
  return (
    <section className="px-4 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Don't Just Take Our Word
            <span className="block text-yellow-400">Take Theirs</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Real people, real results, real money saved. (No, we didn't pay them to say this.)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-gray-900/50 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <p className="text-white font-semibold">{testimonial.name}</p>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
