import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Engineer",
    avatar: "/placeholder.svg?height=60&width=60",
    content: "ShopAI found me the perfect laptop in minutes. The AI really understands what developers need!",
    rating: 5,
  },
  {
    name: "Mike Chen",
    role: "Designer",
    avatar: "/placeholder.svg?height=60&width=60",
    content: "I love how it learns my style preferences. Every recommendation feels personally curated.",
    rating: 5,
  },
  {
    name: "Emily Davis",
    role: "Marketing Manager",
    avatar: "/placeholder.svg?height=60&width=60",
    content: "The price tracking feature saved me hundreds of dollars. Best shopping assistant ever!",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="py-24 bg-surface">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">What Our Users Say</h2>
          <p className="text-xl text-secondary max-w-2xl mx-auto">
            Join thousands of satisfied customers who've transformed their shopping experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-default bg-background">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-secondary mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-primary">{testimonial.name}</div>
                    <div className="text-sm text-muted">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
