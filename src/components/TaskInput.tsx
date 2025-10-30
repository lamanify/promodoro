import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

interface TaskInputProps {
  onAddTask: (title: string, estimatedMinutes: number, category: string, breakMinutes: number) => void;
  categories: string[];
}

export const TaskInput = ({ onAddTask, categories }: TaskInputProps) => {
  const [title, setTitle] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [breakTime, setBreakTime] = useState("");
  const [category, setCategory] = useState(categories[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !estimatedTime) return;

    const estimatedMinutes = parseFloat(estimatedTime) * 60;
    const breakMinutes = parseFloat(breakTime) * 60 || 0;
    onAddTask(title.trim(), estimatedMinutes, category, breakMinutes);
    setTitle("");
    setEstimatedTime("");
    setBreakTime("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="What do you need to focus on?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
      />
      <div className="flex gap-3">
        <Input
          type="number"
          step="0.5"
          min="0.5"
          placeholder="Est. hours"
          value={estimatedTime}
          onChange={(e) => setEstimatedTime(e.target.value)}
          className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
        />
        <Input
          type="number"
          step="0.25"
          min="0"
          placeholder="Break (hrs)"
          value={breakTime}
          onChange={(e) => setBreakTime(e.target.value)}
          className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="bg-secondary border-border text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat} className="text-foreground">
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90">
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};
