import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTeam } from "@/contexts/team-context";
import { useOKRs } from "@/contexts/okr-context";
import { useGoals } from "@/contexts/goal-context";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Info } from "lucide-react";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";

const COLORS = {
  not_started: "#FF4136",
  in_progress: "#FFDC00",
  completed: "#2ECC40",
};

const STATUS_LABELS = {
  not_started: "Not Started",
  in_progress: "In Progress",
  completed: "Completed",
};

export function Reports() {
  const { okrs } = useOKRs();
  const { goals } = useGoals();
  const { members } = useTeam();

  // Prepare data for Team Members by OKR chart
  const teamMembersByOkr = okrs?.map((okr) => ({
    name: okr.title,
    count: goals?.filter((goal) => goal.okr_id === okr.id)
      .map((goal) => goal.team_member_id)
      .filter((value, index, self) => self.indexOf(value) === index)
      .length || 0,
  })) || [];

  // Prepare data for Goals by OKR chart
  const goalsByOkr = okrs?.map((okr) => {
    const okrGoals = goals?.filter((goal) => goal.okr_id === okr.id) || [];
    return {
      name: okr.title,
      not_started: okrGoals.filter((g) => g.status === "not_started").length,
      in_progress: okrGoals.filter((g) => g.status === "in_progress").length,
      completed: okrGoals.filter((g) => g.status === "completed").length,
    };
  }) || [];

  // Prepare data for Goal Status Breakdown chart
  const goalStatusBreakdown = Object.entries(
    (goals || []).reduce((acc, goal) => {
      acc[goal.status] = (acc[goal.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([status, value]) => ({
    name: STATUS_LABELS[status as keyof typeof STATUS_LABELS],
    value,
    color: COLORS[status as keyof typeof COLORS],
  }));

  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <h2 className="text-lg font-semibold">Reports</h2>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {/* Team Members by OKR Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="text-sm font-medium">Team Members by OKR</h3>
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Number of team members working on each OKR</p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={teamMembersByOkr}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Bar dataKey="count" fill="#3D9970" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Goals by OKR Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="text-sm font-medium">Goals by OKR</h3>
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Distribution of goal statuses for each OKR</p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={goalsByOkr}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Bar dataKey="not_started" stackId="a" fill={COLORS.not_started} />
                    <Bar dataKey="in_progress" stackId="a" fill={COLORS.in_progress} />
                    <Bar dataKey="completed" stackId="a" fill={COLORS.completed} />
                    <Legend />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Goal Status Breakdown Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="text-sm font-medium">Goal Status Breakdown</h3>
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Overall distribution of goal statuses</p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={goalStatusBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                      label={(entry) => `${entry.name}: ${entry.value}`}
                    >
                      {goalStatusBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
} 