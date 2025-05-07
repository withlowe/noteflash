import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Separator } from "@/components/ui/separator"

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

      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
          <p className="text-muted-foreground mb-4">Empowering learners through effective study techniques</p>
          <Separator className="mb-4" />
          <p className="mb-4">
            Super Learn is designed to help students, professionals, and lifelong learners optimize their study process
            using proven learning techniques. Our platform combines smart note-taking with spaced repetition flashcards
            and interactive quizzes to maximize knowledge retention.
          </p>
          <p>
            We believe that effective learning comes from active engagement with material, regular review, and testing
            your knowledge. Super Learn brings these principles together in one seamless platform.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">Key Features</h2>
          <p className="text-muted-foreground mb-4">Tools designed for effective learning</p>
          <Separator className="mb-4" />
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Smart Notes</strong> - Take structured notes with markdown support, making it easy to organize
              complex information.
            </li>
            <li>
              <strong>Flashcards with Spaced Repetition</strong> - Convert your notes into flashcards and review them
              using scientifically-proven spaced repetition algorithms.
            </li>
            <li>
              <strong>Interactive Quizzes</strong> - Test your knowledge with multiple-choice quizzes generated from
              your notes and flashcards.
            </li>
            <li>
              <strong>Tag System</strong> - Organize your learning materials with a flexible tagging system for easy
              retrieval.
            </li>
            <li>
              <strong>Progress Tracking</strong> - Monitor your learning progress and focus on areas that need more
              attention.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">The Science Behind Super Learn</h2>
          <p className="text-muted-foreground mb-4">Research-backed learning methods</p>
          <Separator className="mb-4" />
          <p className="mb-4">Super Learn is built on established learning science principles:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Active Recall</strong> - Actively retrieving information strengthens memory more effectively than
              passive review.
            </li>
            <li>
              <strong>Spaced Repetition</strong> - Reviewing information at increasing intervals optimizes long-term
              retention.
            </li>
            <li>
              <strong>Structured Note-Taking</strong> - Organizing information in a structured format improves
              comprehension and recall.
            </li>
            <li>
              <strong>Testing Effect</strong> - Taking tests enhances learning more than additional studying of the same
              material.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-2">Privacy & Data</h2>
          <p className="text-muted-foreground mb-4">Your data stays with you</p>
          <Separator className="mb-4" />
          <p>
            Super Learn stores all your data locally in your browser. We don't collect or store your notes or learning
            materials on our servers. You can export your data at any time for backup or transfer to another device.
          </p>
        </div>
      </div>
    </div>
  )
}
