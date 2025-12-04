import { Header } from "@/components/arab-cup/Header";
import { 
  Mail, 
  Phone, 
  MessageCircle, 
  HelpCircle, 
  Ticket, 
  CreditCard, 
  MapPin, 
  Clock,
  ChevronRight,
  FileText,
  Shield
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I purchase tickets?",
    answer: "Browse matches from the home page, select a match, choose your preferred seat category, add to cart, and complete the checkout process with your payment details."
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept all major credit and debit cards including Visa, Mastercard, and American Express. All transactions are processed securely."
  },
  {
    question: "Can I get a refund for my tickets?",
    answer: "Refund policies vary by event. Please contact our support team for specific refund requests. Generally, tickets are non-refundable unless the event is cancelled."
  },
  {
    question: "How will I receive my tickets?",
    answer: "Tickets are delivered digitally through the Road to Qatar app. You will receive a confirmation email with instructions to access your tickets."
  },
  {
    question: "Can I transfer my tickets to someone else?",
    answer: "Ticket transfer policies depend on the specific event. Contact our support team for assistance with ticket transfers."
  },
  {
    question: "What if I lose my tickets?",
    answer: "Digital tickets can be re-accessed through the Road to Qatar app using your registered email. Contact support if you need additional help."
  }
];

const contactOptions = [
  {
    icon: Mail,
    title: "Email Support",
    description: "tickets@roadtoqatar.qa",
    action: "mailto:tickets@roadtoqatar.qa"
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "+974 4000 2022",
    action: "tel:+97440002022"
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Available 24/7",
    action: "#"
  }
];

export default function Help() {
  return (
    <div className="min-h-screen bg-[#f7f7f7] font-sans pb-10">
      <Header />
      
      <div className="bg-[#8A1538] text-white px-6 py-8">
        <div className="flex items-center gap-3 mb-2">
          <HelpCircle className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Help Center</h1>
        </div>
        <p className="text-white/80 text-sm">
          Find answers to common questions or contact our support team
        </p>
      </div>

      <div className="px-4 py-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-[#8A1538]" />
          Contact Us
        </h2>
        
        <div className="space-y-3 mb-8">
          {contactOptions.map((option, index) => (
            <a
              key={index}
              href={option.action}
              className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              data-testid={`contact-${option.title.toLowerCase().replace(' ', '-')}`}
            >
              <div className="w-12 h-12 bg-[#8A1538]/10 rounded-full flex items-center justify-center">
                <option.icon className="w-6 h-6 text-[#8A1538]" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{option.title}</div>
                <div className="text-sm text-gray-500">{option.description}</div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </a>
          ))}
        </div>

        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#8A1538]" />
          Frequently Asked Questions
        </h2>
        
        <Accordion type="single" collapsible className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-100 last:border-0">
              <AccordionTrigger 
                className="px-4 py-4 text-left text-sm font-medium text-gray-900 hover:no-underline hover:bg-gray-50"
                data-testid={`faq-question-${index}`}
              >
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-sm text-gray-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-[#8A1538]" />
            Quick Links
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <CreditCard className="w-8 h-8 text-[#8A1538] mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">Payment Info</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <MapPin className="w-8 h-8 text-[#8A1538] mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">Venue Maps</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <Clock className="w-8 h-8 text-[#8A1538] mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">Match Schedule</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <Shield className="w-8 h-8 text-[#8A1538] mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">Terms & Privacy</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
