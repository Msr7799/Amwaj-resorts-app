"use client";
import React from "react";
import Image from "next/image";
import { StickyScroll } from "../ui/sticky-scroll-reveal";

interface ResortStickyScrollProps {
  resortId: string;
}

export function ResortStickyScroll({ resortId }: ResortStickyScrollProps) {
  const resort1Content = [
    {
      title: "غرفة النوم الرئيسية",
      description:
        "غرفة نوم فاخرة مع سرير كينج سايز، تصميم عصري مريح، إطلالة ساحرة على البحر، وجميع وسائل الراحة التي تحتاجها لإقامة مثالية.",
      content: (
        <div className="flex h-full w-full items-center justify-center">
          <Image
            src="/assets/resort1/19.jpeg"
            width={400}
            height={400}
            className="h-full w-full object-cover"
            alt="غرفة النوم الرئيسية"
          />
        </div>
      ),
    },
    {
      title: "المسبح الخاص",
      description:
        "مسبح خاص فاخر مع إطلالة بانورامية، مثالي للاسترخاء والاستمتاع بالأجواء الهادئة. مزود بمنطقة جلوس مريحة وإضاءة ليلية رومانسية.",
      content: (
        <div className="flex h-full w-full items-center justify-center">
          <Image
            src="/assets/resort1/13.jpeg"
            width={400}
            height={400}
            className="h-full w-full object-cover"
            alt="المسبح الخاص"
          />
        </div>
      ),
    },
    {
      title: "منطقة المعيشة",
      description:
        "مساحة واسعة ومريحة للاسترخاء مع العائلة، تحتوي على أريكة فاخرة، تلفزيون ذكي، ونوافذ كبيرة تسمح بدخول الضوء الطبيعي.",
      content: (
        <div className="flex h-full w-full items-center justify-center">
          <Image
            src="/assets/resort1/7.jpeg"
            width={400}
            height={400}
            className="h-full w-full object-cover"
            alt="منطقة المعيشة"
          />
        </div>
      ),
    },
  ];

  const resort2Content = [
    {
      title: "الغرفة الفاخرة",
      description:
        "غرفة نوم أنيقة بتصميم معاصر، مزودة بجميع الأثاث العصري والمرافق الفندقية الفاخرة. مع إطلالة ساحرة توفر أجواء هادئة ومريحة.",
      content: (
        <div className="flex h-full w-full items-center justify-center">
          <Image
            src="/assets/resort2/17.jpeg"
            width={400}
            height={400}
            className="h-full w-full object-cover"
            alt="الغرفة الفاخرة"
          />
        </div>
      ),
    },
    {
      title: "منطقة الشواء",
      description:
        "منطقة خارجية مجهزة بالكامل للشواء والولائم العائلية، مع طاولات وكراسي مريحة، وإطلالة رائعة على المساحات الخضراء.",
      content: (
        <div className="flex h-full w-full items-center justify-center">
          <Image
            src="/assets/resort2/14.jpeg"
            width={400}
            height={400}
            className="h-full w-full object-cover"
            alt="منطقة الشواء"
          />
        </div>
      ),
    },
    {
      title: "المطبخ المجهز",
      description:
        "مطبخ حديث ومجهز بالكامل بجميع الأجهزة الكهربائية، أدوات الطبخ، والأواني. مثالي لتحضير وجباتك المفضلة في أجواء مريحة.",
      content: (
        <div className="flex h-full w-full items-center justify-center">
          <Image
            src="/assets/resort2/10.jpeg"
            width={400}
            height={400}
            className="h-full w-full object-cover"
            alt="المطبخ المجهز"
          />
        </div>
      ),
    },
  ];

  const content = resortId === "resort-1" ? resort1Content : resort2Content;

  return (
    <div className="w-full py-8">
      <div className="container mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
          جولة في الشاليه
        </h2>
        <p className="text-gray-600 text-center mt-4 max-w-2xl mx-auto">
          اكتشف التفاصيل الفاخرة والمرافق المميزة في شاليهنا
        </p>
      </div>
      <StickyScroll content={content} />
    </div>
  );
}
