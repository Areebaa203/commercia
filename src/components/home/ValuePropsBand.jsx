import { Icon } from "@iconify/react";
import { VALUE_PROPS } from "@/components/home/homeValuePropsData";
import { cn } from "@/lib/utils";

const ACCENT = "#24352D";

/** Same three-column trust strip as home — reused on PDP and elsewhere */
export default function ValuePropsBand({ sectionClassName, innerClassName }) {
  return (
    <section
      className={
        sectionClassName ??
        "border-y border-[#e8e4dc] bg-[#FAF9F6] py-6 sm:py-10 md:py-14 lg:py-16"
      }
    >
      <div className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", innerClassName)}>
        <div className="grid grid-cols-1 gap-8 sm:gap-9 md:grid-cols-3 md:gap-8 lg:gap-12">
          {VALUE_PROPS.map((item) => (
            <div key={item.id} className="flex flex-col">
              <span className="mb-3 inline-flex sm:mb-4" style={{ color: ACCENT }} aria-hidden>
                <Icon icon={item.icon} className="size-7 sm:size-8 md:size-9" />
              </span>
              <h3
                className="font-home-heading text-lg leading-snug sm:text-xl md:text-2xl"
                style={{ color: ACCENT }}
              >
                {item.title}
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-neutral-700 sm:mt-3 sm:text-[15px]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
