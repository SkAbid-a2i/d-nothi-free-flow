import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  HelpCircle, 
  Search, 
  PlayCircle, 
  BookOpen, 
  MessageSquare, 
  Phone,
  Mail,
  Download,
  ExternalLink,
  Video,
  FileText,
  Users
} from 'lucide-react';

export const Help = () => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          question: 'How do I log my first task?',
          answer: 'Go to Task Logger from the sidebar menu. Fill in all required fields including date/time, source, category, service, and description. Click Submit to save your task.'
        },
        {
          question: 'How do I change my language preference?',
          answer: 'Click on the language toggle (Bn/En) in the top header to switch between Bengali and English. Your preference will be saved automatically.'
        },
        {
          question: 'How do I request leave?',
          answer: 'Navigate to Leave Management from the sidebar. Click on "Request Leave" and fill in the start date, end date, leave type, and reason. Submit for approval.'
        }
      ]
    },
    {
      category: 'Task Management',
      questions: [
        {
          question: 'What are the different task statuses?',
          answer: 'Tasks can have two statuses: Pending (not yet completed) and Done (completed). You can update the status when editing a task.'
        },
        {
          question: 'How do I upload files with my tasks?',
          answer: 'When creating or editing a task, use the file upload section at the bottom of the form. You can upload PDFs, images, and documents up to your 500MB quota.'
        },
        {
          question: 'Can I edit tasks after submitting?',
          answer: 'Yes, you can edit your own tasks from the My Tasks page. Click on any task row to view and modify the details.'
        }
      ]
    },
    {
      category: 'Dashboards & Reports',
      questions: [
        {
          question: 'How do I view my task statistics?',
          answer: 'Your Dashboard shows comprehensive statistics including daily, weekly, monthly, and yearly task counts with interactive charts.'
        },
        {
          question: 'How can I export my task data?',
          answer: 'From My Tasks page, you can export your data in CSV or PDF format using the export buttons in the toolbar.'
        },
        {
          question: 'What charts are available on the dashboard?',
          answer: 'You can choose between Pie charts (task distribution), Bar charts (task counts over time), and Line charts (trend analysis).'
        }
      ]
    },
    {
      category: 'Team Management (Admin/Supervisor)',
      questions: [
        {
          question: 'How do I approve leave requests?',
          answer: 'As an Admin or Supervisor, go to Leave Management to see all pending requests. Click Approve or Reject for each request.'
        },
        {
          question: 'How do I view team member tasks?',
          answer: 'Use the Team Tasks page to see all tasks from your team members. You can filter by user, date, status, and more.'
        },
        {
          question: 'How do I create new dropdown options?',
          answer: 'Go to Admin Console > Dropdown Settings to add new sources, categories, services, and office locations for task logging.'
        }
      ]
    },
    {
      category: 'Account & Security',
      questions: [
        {
          question: 'How do I change my password?',
          answer: 'Currently, password changes need to be done through your system administrator. Contact admin support for password reset.'
        },
        {
          question: 'What is my file storage quota?',
          answer: 'Each user has a 500MB storage quota for file uploads. You can see your current usage in the file upload sections.'
        },
        {
          question: 'How long are my sessions active?',
          answer: 'For security, your session will automatically log out after a period of inactivity. The exact time is configured by your system administrator.'
        }
      ]
    }
  ];

  const tutorials = [
    {
      title: 'Getting Started with D-Nothi',
      description: 'Complete walkthrough for new users',
      duration: '5 min',
      type: 'video',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      title: 'Task Logging Best Practices',
      description: 'Learn how to log tasks effectively',
      duration: '3 min',
      type: 'video',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      title: 'Dashboard and Reporting Guide',
      description: 'Understanding your analytics and reports',
      duration: '4 min',
      type: 'video',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      title: 'Leave Management Tutorial',
      description: 'Requesting and managing leave',
      duration: '2 min',
      type: 'video',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    }
  ];

  const guides = [
    {
      title: 'User Manual (English)',
      description: 'Comprehensive user guide in English',
      format: 'PDF',
      size: '2.3 MB'
    },
    {
      title: 'ব্যবহারকারীর গাইড (বাংলা)',
      description: 'সম্পূর্ণ ব্যবহারকারীর গাইড বাংলায়',
      format: 'PDF',
      size: '2.8 MB'
    },
    {
      title: 'Quick Reference Card',
      description: 'Keyboard shortcuts and quick tips',
      format: 'PDF',
      size: '456 KB'
    },
    {
      title: 'Admin Guide',
      description: 'Administrative functions and setup',
      format: 'PDF',
      size: '1.9 MB'
    }
  ];

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Help & Support</h1>
          <p className="text-muted-foreground">Find answers and learn how to use D-Nothi effectively</p>
        </div>
        <Badge className="bg-gradient-primary text-white px-3 py-1">
          <HelpCircle className="w-4 h-4 mr-1" />
          Support Center
        </Badge>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search help articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 text-lg py-6"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="tutorials" className="flex items-center gap-2">
            <PlayCircle className="w-4 h-4" />
            Video Tutorials
          </TabsTrigger>
          <TabsTrigger value="guides" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            User Guides
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Contact Support
          </TabsTrigger>
        </TabsList>

        {/* FAQ Tab */}
        <TabsContent value="faq">
          <div className="space-y-6">
            {filteredFaqs.map((category, categoryIndex) => (
              <Card key={categoryIndex}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${categoryIndex}-${index}`}>
                        <AccordionTrigger className="text-left hover:no-underline">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tutorials Tab */}
        <TabsContent value="tutorials">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tutorials.map((tutorial, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                    <iframe
                      src={tutorial.url}
                      title={tutorial.title}
                      className="w-full h-full rounded-lg"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5" />
                    {tutorial.title}
                  </CardTitle>
                  <p className="text-muted-foreground">{tutorial.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{tutorial.duration}</Badge>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Watch Full Screen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Guides Tab */}
        <TabsContent value="guides">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guides.map((guide, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{guide.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{guide.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs">{guide.format}</Badge>
                          <span>{guide.size}</span>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Get help via email for non-urgent questions and technical issues.
                </p>
                <div className="space-y-2">
                  <div className="text-sm">
                    <strong>General Support:</strong><br />
                    <a href="mailto:support@dnothi.com" className="text-primary hover:underline">
                      support@dnothi.com
                    </a>
                  </div>
                  <div className="text-sm">
                    <strong>Technical Issues:</strong><br />
                    <a href="mailto:tech@dnothi.com" className="text-primary hover:underline">
                      tech@dnothi.com
                    </a>
                  </div>
                </div>
                <Button className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Phone Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Speak directly with our support team for urgent matters.
                </p>
                <div className="space-y-2">
                  <div className="text-sm">
                    <strong>Support Hotline:</strong><br />
                    <a href="tel:+8801234567890" className="text-primary hover:underline">
                      +880 1234-567890
                    </a>
                  </div>
                  <div className="text-sm">
                    <strong>Hours:</strong><br />
                    Sunday - Thursday: 9 AM - 6 PM<br />
                    Saturday: 10 AM - 4 PM
                  </div>
                </div>
                <Button className="w-full">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Live Chat
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Chat with our support team in real-time for quick assistance.
                </p>
                <div className="space-y-2">
                  <div className="text-sm">
                    <strong>Availability:</strong><br />
                    Monday - Friday: 9 AM - 5 PM<br />
                    Average Response: &lt; 2 minutes
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-sm text-success">Online Now</span>
                  </div>
                </div>
                <Button className="w-full">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Start Chat
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Additional Resources */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Additional Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                  <ExternalLink className="w-6 h-6" />
                  <div className="text-center">
                    <div className="font-medium">Knowledge Base</div>
                    <div className="text-xs text-muted-foreground">Detailed articles</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                  <Users className="w-6 h-6" />
                  <div className="text-center">
                    <div className="font-medium">Community Forum</div>
                    <div className="text-xs text-muted-foreground">User discussions</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                  <BookOpen className="w-6 h-6" />
                  <div className="text-center">
                    <div className="font-medium">Training Materials</div>
                    <div className="text-xs text-muted-foreground">Learning resources</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                  <Download className="w-6 h-6" />
                  <div className="text-center">
                    <div className="font-medium">Downloads</div>
                    <div className="text-xs text-muted-foreground">Apps & tools</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};