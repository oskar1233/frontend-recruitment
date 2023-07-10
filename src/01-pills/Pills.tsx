import React, { useEffect, useLayoutEffect } from 'react';
import { PillData } from './data';
import { Pill } from './Pill';

interface PillsProps {
  pills: PillData[];
  headers: string[]; // ids of pills that are toggled on
  toggleHeader: (id: string) => void;
}

interface LayoutBreakElement {
  index: string;
  type: 'line-break';
}

interface LayoutPillElement {
  index: string;
  type: 'pill';
  pill: PillData;
}

type LayoutElement = LayoutBreakElement | LayoutPillElement;

export function Pills({ pills, headers, toggleHeader }: PillsProps) {
  const containerNode = React.useRef<HTMLDivElement>(null);
  const pillRefs = React.useRef<{ [id: PillData['id']]: HTMLDivElement }>({});

  // Used to measure how much space a pill header takes up
  const measurePillHeader = React.useRef<HTMLDivElement>(null);
  const measurePillNoHeader = React.useRef<HTMLDivElement>(null);

  const [additionalSpacePerPill, setAdditionalSpacePerPill] = React.useState<number>(0);
  const [layoutWidth, setLayoutWidth] = React.useState<number>(0);
  const [layoutElements, setLayoutElements] = React.useState<LayoutElement[]>(
    () => {
      return pills.map((pill) => ({
        index: pill.id,
        type: 'pill',
        pill: pill,
      }));
    }
  );

  // Measure how much space a pill header takes up
  useLayoutEffect(() => {
    setAdditionalSpacePerPill(measurePillHeader.current!.clientWidth - measurePillNoHeader.current!.clientWidth);
  }, []);

  // Measure how much space the container offers
  useLayoutEffect(() => {
    setLayoutWidth(containerNode.current!.clientWidth);

    function handleResize() {
      setLayoutWidth(containerNode.current!.clientWidth);
    }

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Create a pill element from a pill data object and index
    const layoutElementFromPill = (pill: PillData, index: number) => {
      const layoutElement = {
        index: index.toString(),
        type: 'pill' as 'pill',
        pill: pill
      };

      index++;

      return layoutElement;
    };

    // Create line break element from index
    const lineBreakElement = (index: number): LayoutBreakElement => ({index: index.toString(), type: 'line-break'});

    // Create layout elements from pills and make sure they fit in the layout
    const layoutElements = pills.reduce<{width: number, elements: LayoutElement[]}>((acc, pill, index) => {
      const pillRef = pillRefs.current[pill.id]!;
      const pillWidth = headers.includes(pill.id) ? pillRef.clientWidth : pillRef.clientWidth + additionalSpacePerPill;

      if (acc.width + pillWidth > layoutWidth) {
        return {
          elements: [...acc.elements, lineBreakElement(index), layoutElementFromPill(pill, index)],
          width: pillWidth,
        };
      } else {
        return {
          elements: [...acc.elements, layoutElementFromPill(pill, index)],
          width: acc.width + pillWidth,
        };
      }
    }, {elements: [], width: 0}).elements;

    setLayoutElements(layoutElements);

  }, [pills, layoutWidth]);

  const setPillRef = (id: PillData['id'], node: HTMLDivElement) => {
    if (node) {
      pillRefs.current[id] = node;
    }
  };

  return (
    <div ref={containerNode}>
      {layoutElements.map((el) => {
        if (el.type === 'line-break') {
          return <br key={`__${el.type}-${el.index}`} />;
        } else {
          return (
            <Pill
              key={el.pill.id}
              header={headers.includes(el.pill.id)}
              onClick={() => {
                toggleHeader(el.pill.id);
              }}
              ref={(element) => element && setPillRef(el.pill.id, element)}
            >
              {el.pill.value}
            </Pill>
          );
        }
        })}

      <div style={{position: 'absolute', visibility: 'hidden', zIndex: -1}}>
        <Pill ref={measurePillNoHeader} header={false} onClick={() => {}}>test</Pill>
        <Pill ref={measurePillHeader} header={true} onClick={() => {}}>test</Pill>
      </div>
    </div>
  );
}
