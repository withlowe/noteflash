import Link from "next/link"
import { ArrowLeft, FileText, ShieldCheck, Book, Scale, AlertTriangle, RefreshCw } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-2">
        <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to home
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Terms of Service</h1>
        <p className="text-muted-foreground mt-2">Guidelines for using Super Learn</p>
        <Separator className="mt-6" />
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary" />
              Acceptance of Terms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              By accessing or using Super Learn, you agree to be bound by these Terms of Service. If you do not agree to
              these terms, please do not use the service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Book className="h-5 w-5 mr-2 text-primary" />
              Description of Service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Super Learn provides a browser-based learning platform with note-taking, flashcard, and quiz
              functionality. All data is stored locally in your browser.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
              User Responsibilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              You are responsible for maintaining the confidentiality of your data and for all activities that occur
              under your use. We recommend regularly backing up your data using the export functionality.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Scale className="h-5 w-5 mr-2 text-primary" />
              Intellectual Property
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              The content you create using Super Learn belongs to you. The Super Learn application, including its
              design, code, and features, is protected by copyright and other intellectual property laws.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-primary" />
              Limitation of Liability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Super Learn is provided "as is" without warranties of any kind. We are not responsible for any data loss
              or other damages that may occur from using the service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <RefreshCw className="h-5 w-5 mr-2 text-primary" />
              Changes to Terms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              We reserve the right to modify these terms at any time. We will provide notice of significant changes by
              posting the new Terms of Service on this page.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-medium mb-3">Governing Law</h2>
            <p className="mb-6">
              These Terms shall be governed by the laws of the jurisdiction in which we operate, without regard to its
              conflict of law provisions.
            </p>
            <p className="text-sm text-muted-foreground">Last updated: May 6, 2025</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
