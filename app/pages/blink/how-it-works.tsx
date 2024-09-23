"use client";

export default function Page() {
  return <h1>How it Works?</h1>
}

import { CheckCircle, Paintbrush, Puzzle, Rocket } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Component() {
  const steps = [
    {
      title: "Choose Your Template",
      description: "Select from our range of pre-built templates tailored for various use cases.",
      icon: <CheckCircle className="h-8 w-8 text-primary" />,
    },
    {
      title: "Customize Your Blink",
      description: "Modify the template to fit your specific needs using our intuitive interface.",
      icon: <Paintbrush className="h-8 w-8 text-primary" />,
    },
    {
      title: "Add Integrations",
      description: "Easily integrate third-party services and APIs to enhance your application.",
      icon: <Puzzle className="h-8 w-8 text-primary" />,
    },
    {
      title: "Deploy and Scale",
      description: "Launch your Blink and easily scale as your user base grows.",
      icon: <Rocket className="h-8 w-8 text-primary" />,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
                  {index + 1}
                </span>
                {step.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between">
              <p className="text-muted-foreground mb-4">{step.description}</p>
              <div className="flex justify-center">{step.icon}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}