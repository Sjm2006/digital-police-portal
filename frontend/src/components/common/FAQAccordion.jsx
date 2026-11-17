import { useId, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const cx = (...classes) => classes.filter(Boolean).join(' ');

export default function FAQAccordion({ items = [], className }) {
  const baseId = useId();
  const [openItems, setOpenItems] = useState(() => new Set());
  const buttonRefs = useRef([]);

  if (items.length === 0) {
    return <p className="text-sm text-slate-600">No questions to display.</p>;
  }

  const toggle = (index) => {
    setOpenItems((previous) => {
      const next = new Set(previous);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const focusButton = (index) => {
    buttonRefs.current[index]?.focus();
  };

  const handleKeyDown = (event, index) => {
    const last = items.length - 1;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusButton(index === last ? 0 : index + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusButton(index === 0 ? last : index - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusButton(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusButton(last);
    }
  };

  return (
    <div className={cx('divide-y divide-line rounded border border-line bg-white shadow-card', className)}>
      {items.map((item, index) => {
        const isOpen = openItems.has(index);
        const buttonId = `${baseId}-question-${index}`;
        const panelId = `${baseId}-answer-${index}`;

        return (
          <div key={item.question}>
            <h3>
              <button
                ref={(element) => {
                  buttonRefs.current[index] = element;
                }}
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(index)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-brand-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500"
              >
                <span className="text-base font-semibold text-brand-800">{item.question}</span>
                <ChevronDown
                  className={cx(
                    'h-5 w-5 shrink-0 text-brand-600 transition-transform duration-200 motion-reduce:transition-none',
                    isOpen && 'rotate-180'
                  )}
                  aria-hidden="true"
                />
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cx(
                'grid transition-[grid-template-rows,visibility] duration-200 motion-reduce:transition-none',
                isOpen ? 'visible grid-rows-[1fr]' : 'invisible grid-rows-[0fr]'
              )}
            >
              <div className="overflow-hidden">
                <p className="border-t border-line bg-surface px-5 py-4 text-sm leading-relaxed text-slate-700">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}