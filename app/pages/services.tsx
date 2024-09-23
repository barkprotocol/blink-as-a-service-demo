"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Zap, Shield, Code } from 'lucide-react';

export default function ServicePage() {
  const features = [
    { icon: Zap, title: "Lightning-Fast Setup", description: "Get your Blink service up and running in minutes, not hours." },
    { icon: Shield, title: "Built-in Security", description: "Robust security measures to protect your users and data." },
    { icon: Code, title: "Developer-Friendly", description: "Intuitive APIs and comprehensive documentation for seamless integration." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="container mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Build Your Blink Faster Than Ever</h1>
          <p className="text-xl text-gray-600 mb-8">
            Launch your Blink As A Service product in record time with our powerful, ready-to-use template. 
            Packed with modern technologies and essential integrations.
          </p>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Get Started Now
          </Button>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="hover:scale-105 transition-transform duration-200">
              <CardHeader>
                <feature.icon className="h-10 w-10 text-primary mb-2" aria-hidden="true" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="bg-gray-100 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold mb-4">Why Choose Our Blink Service?</h2>
          <ul className="space-y-4">
            {[
              "Rapid deployment with our streamlined setup process",
              "Scalable architecture to grow with your business",
              "Comprehensive analytics to track your service's performance",
              "24/7 support from our expert team",
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Revolutionize Your Blink Service?</h2>
          <p className="text-gray-600 mb-8">
            Join the growing community of users leveraging our Blink As A Service platform.
          </p>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Start Building Today
          </Button>
        </section>
      </main>
    </div>
  );
}
