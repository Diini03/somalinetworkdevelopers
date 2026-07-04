import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { FilterRail } from "./FilterRail";
import { ComponentProps } from "react";

type Props = ComponentProps<typeof FilterRail> & {
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

export const FilterSheet = ({ open, onOpenChange, ...rest }: Props) => (
  <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetContent side="left" className="p-0 w-[300px]">
      <SheetHeader className="px-5 py-4 border-b border-border">
        <SheetTitle className="text-sm">Filters</SheetTitle>
      </SheetHeader>
      <div className="lg:hidden [&_aside]:!block [&_aside]:!w-full [&_aside]:!border-0">
        <FilterRail {...rest} />
      </div>
    </SheetContent>
  </Sheet>
);
