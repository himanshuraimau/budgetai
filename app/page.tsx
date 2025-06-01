import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center">
            <span className="text-xl font-bold text-emerald-600">BudgetAI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-gradient-to-b from-white to-gray-50 py-20 md:py-32">
          <div className="container flex flex-col items-center text-center">
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              AI-Powered Budget Management for Modern Teams
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              Streamline your company's spending with intelligent budget management. Automate approvals, track expenses,
              and gain insights with our AI assistant.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/auth/signup">
                <Button size="lg" className="h-12 px-8">
                  Get Started
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-12 px-8">
                Book a Demo
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container">
            <h2 className="text-center text-3xl font-bold">Key Features</h2>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "AI Approvals",
                  description: "Intelligent purchase request approvals based on budget and rules",
                },
                {
                  title: "Budget Tracking",
                  description: "Real-time visibility into department spending and budgets",
                },
                {
                  title: "Spending Insights",
                  description: "Actionable insights to optimize your company's spending",
                },
                {
                  title: "Simple Workflow",
                  description: "Streamlined process for requesting and approving purchases",
                },
              ].map((feature, index) => (
                <div key={index} className="rounded-lg border p-6">
                  <div className="mb-4 rounded-full bg-emerald-100 p-2 w-fit">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="mb-2 text-xl font-medium">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center">
            <span className="text-lg font-bold text-emerald-600">BudgetAI</span>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} BudgetAI. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
