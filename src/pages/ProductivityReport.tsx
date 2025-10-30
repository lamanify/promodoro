import { useState, useMemo } from "react";
import { DateRange } from "react-day-picker";
import { useTasks } from "@/hooks/useTasks";
import ReportFilters from "@/components/ReportFilters";
import ProductivityGraph from "@/components/ProductivityGraph";
import ProductivityStats from "@/components/ProductivityStats";
import MostProductiveTimes from "@/components/MostProductiveTimes";

const ProductivityReport = () => {
  const tasks = useTasks();
  const [listFilter, setListFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (!task.completed || !task.completedAt) return false;
      const taskDate = new Date(task.completedAt);
      const isAfterFrom = !dateFilter?.from || taskDate >= dateFilter.from;
      const isBeforeTo = !dateFilter?.to || taskDate <= dateFilter.to;
      const inList = listFilter === "all" || task.category === listFilter;
      return isAfterFrom && isBeforeTo && inList;
    });
  }, [tasks, listFilter, dateFilter]);

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Productivity Report</h1>
        <ReportFilters
          listFilter={listFilter}
          onListFilterChange={setListFilter}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
        />
      </div>
      <ProductivityStats tasks={filteredTasks} />
      <ProductivityGraph tasks={filteredTasks} />
      <MostProductiveTimes tasks={filteredTasks} />
    </div>
  );
};

export default ProductivityReport;
