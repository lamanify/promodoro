import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRange } from "react-day-picker";

interface ReportFiltersProps {
  listFilter: string;
  onListFilterChange: (value: string) => void;
  dateFilter: DateRange | undefined;
  onDateFilterChange: (date: DateRange | undefined) => void;
}

const ReportFilters = ({
  listFilter,
  onListFilterChange,
  dateFilter,
  onDateFilterChange,
}: ReportFiltersProps) => {
  return (
    <div className="flex items-center space-x-4">
      <Select value={listFilter} onValueChange={onListFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by List" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Lists</SelectItem>
          <SelectItem value="Work">Work</SelectItem>
          <SelectItem value="Personal">Personal</SelectItem>
          <SelectItem value="Learning">Learning</SelectItem>
          <SelectItem value="Projects">Projects</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant={"outline"}>
            {dateFilter?.from?.toLocaleDateString() ?? "Start Date"} -{" "}
            {dateFilter?.to?.toLocaleDateString() ?? "End Date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateFilter?.from}
            selected={dateFilter}
            onSelect={onDateFilterChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ReportFilters;
