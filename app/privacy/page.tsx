import Link from "next/link"
import { ArrowLeft, Lock, Download, Cookie, Globe, Bell } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-2">
        <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to home
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="text-muted-foreground mt-2">How we handle your data</p>
        <Separator className="mt-6" />
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Lock className="h-5 w-5 mr-2 text-primary" />
              Data Storage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Super Learn is designed with privacy in mind. All your notes, flashcards, and learning data are stored
              locally in your browser using localStorage. We do not collect, transmit, or store your content on our
              servers.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Download className="h-5 w-5 mr-2 text-primary" />
              Data Export and Backup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              You can export your data at any time using the Export feature. We recommend regularly backing up your data
              to prevent loss due to browser data clearing or device changes.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Cookie className="h-5 w-5 mr-2 text-primary" />
              Cookies and Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Super Learn does not use cookies or tracking technologies to monitor your usage or collect analytics data.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2 text-primary" />
              Third-Party Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>We do not integrate with third-party services that would collect or process your data.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2 text-primary" />
              Changes to This Policy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-medium mb-3">Contact Us</h2>
            <p className="mb-6">
              If you have any questions about this Privacy Policy, please contact us at privacy@superlearn.example.com.
            </p>
            <p className="text-sm text-muted-foreground">Last updated: May 6, 2025</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
