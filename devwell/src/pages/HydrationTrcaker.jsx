
const HydrationTracker = () => {
  const [glasses, setGlasses] = useState(0);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Hydration</CardTitle>
        <CardDescription>Track your daily water intake</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <p className="text-sm text-emerald-700 dark:text-emerald-300">Glasses today: {glasses}</p>
          <Button onClick={() => setGlasses(glasses + 1)}>Add Glass</Button>
          <Button variant="ghost" onClick={() => setGlasses(0)}>Reset</Button>
        </div>
      </CardContent>
    </Card>
  );
};


export default HydrationTracker;