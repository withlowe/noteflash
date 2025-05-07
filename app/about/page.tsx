import Link from "next/link"
import { ArrowLeft, Book, Brain, Calendar, Lightbulb, Shield } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-2">
        <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to home
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">About Super Learn</h1>
        <p className="text-muted-foreground mt-2">Learn more about our learning platform</p>
        <Separator className="mt-6" />
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-2xl">
              <Lightbulb className="h-6 w-6 mr-2 text-primary" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-lg">Empowering learners through effective study techniques</p>
            <p className="mb-4">
              Super Learn is designed to help students, professionals, and lifelong learners optimize their study
              process using proven learning techniques. Our platform combines smart note-taking with spaced repetition
              flashcards and interactive quizzes to maximize knowledge retention.
            </p>
            <p>
              We believe that effective learning comes from active engagement with material, regular review, and testing
              your knowledge. Super Learn brings these principles together in one seamless platform.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-2xl">
              <Book className="h-6 w-6 mr-2 text-primary" />
              Key Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-lg">Tools designed for effective learning</p>
            <ul className="space-y-4">
              <li className="flex">
                <div className="mr-3 bg-primary/10 p-2 rounded-full h-10 w-10 flex items-center justify-center shrink-0">
                  <Book className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <strong className="text-lg">Smart Notes</strong>
                  <p className="text-muted-foreground">
                    Take structured notes with markdown support, making it easy to organize complex information.
                  </p>
                </div>
              </li>
              <li className="flex">
                <div className="mr-3 bg-primary/10 p-2 rounded-full h-10 w-10 flex items-center justify-center shrink-0">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <strong className="text-lg">Flashcards with Spaced Repetition</strong>
                  <p className="text-muted-foreground">
                    Convert your notes into flashcards and review them using scientifically-proven spaced repetition
                    algorithms.
                  </p>
                </div>
              </li>
              <li className="flex">
                <div className="mr-3 bg-primary/10 p-2 rounded-full h-10 w-10 flex items-center justify-center shrink-0">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <strong className="text-lg">Interactive Quizzes</strong>
                  <p className="text-muted-foreground">
                    Test your knowledge with multiple-choice quizzes generated from your notes and flashcards.
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-2xl">
              <Brain className="h-6 w-6 mr-2 text-primary" />
              The Science Behind Super Learn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-lg">Research-backed learning methods</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-lg mb-2">Active Recall</h3>
                <p className="text-muted-foreground">
                  Actively retrieving information strengthens memory more effectively than passive review.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-lg mb-2">Spaced Repetition</h3>
                <p className="text-muted-foreground">
                  Reviewing information at increasing intervals optimizes long-term retention.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-lg mb-2">Structured Note-Taking</h3>
                <p className="text-muted-foreground">
                  Organizing information in a structured format improves comprehension and recall.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-lg mb-2">Testing Effect</h3>
                <p className="text-muted-foreground">
                  Taking tests enhances learning more than additional studying of the same material.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-2xl">
              <Shield className="h-6 w-6 mr-2 text-primary" />
              Privacy & Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4 text-lg">Your data stays with you</p>
            <p>
              Super Learn stores all your data locally in your browser. We don't collect or store your notes or learning
              materials on our servers. You can export your data at any time for backup or transfer to another device.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
