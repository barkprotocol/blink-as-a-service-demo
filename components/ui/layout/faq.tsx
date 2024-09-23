import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Plus } from "lucide-react";

const FAQSection = () => {
  return (
    <section className="py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 sm:text-4xl mb-8">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {[
            {
              question: "What is BARK Blink?",
              answer: "BARK Blink is a powerful Blink As A Service platform that enables developers to create fast, efficient, and secure Solana-based applications and actions. It provides a suite of tools and services to streamline blockchain development on the Solana network."
            },
            {
              question: "How does Blinkboard work?",
              answer: "Blinkboard is an intuitive interface within BARK Blink that allows developers to create, manage, and deploy Solana blinks using a drag-and-drop system. It offers real-time preview, testing capabilities, and one-click deployment to Solana mainnet or testnet."
            },
            {
              question: "What kind of applications can I build with BARK Blink?",
              answer: "With BARK Blink, you can build a wide range of Solana-based applications, including but not limited to: instant donation systems, decentralized crowdfunding platforms, micro-payment solutions, token swap interfaces, and various DeFi applications."
            },
            {
              question: "Is BARK Blink suitable for beginners?",
              answer: "Yes, BARK Blink is designed to be accessible for developers of all skill levels. While prior knowledge of Solana and blockchain concepts is helpful, our intuitive tools and comprehensive documentation make it easier for beginners to get started with Solana development."
            },
            {
              question: "How does BARK Blink ensure security?",
              answer: "BARK Blink implements robust security measures to protect user assets and sensitive data. This includes secure key management, encrypted communications, and regular security audits. We also provide best practices and guidelines to help developers build secure applications."
            }
          ].map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-left">
                <span className="flex items-center">
                  <Plus className="h-5 w-5 mr-2 flex-shrink-0 accordion-icon" />
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;