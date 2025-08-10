import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer",
    content:
      "This app literally saved my financial life. The AI caught spending patterns I never noticed. Now I'm actually saving money instead of wondering where it all went.",
    rating: 5,
  },
  {
    name: "Marcus Rodriguez",
    role: "Small Business Owner",
    content:
      "Finally, a finance app that doesn't make me feel like I need an MBA to use it. The AI insights are spot-on and the interface is actually enjoyable.",
    rating: 5,
  },
  {
    name: "Emily Watson",
    role: "Marketing Manager",
    content:
      "I was skeptical about AI managing my finances, but this app proved me wrong. It's like having a personal financial advisor who actually understands my lifestyle.",
    rating: 5,
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
