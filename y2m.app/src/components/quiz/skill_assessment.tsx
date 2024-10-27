import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardFooter, CardTitle, CardContent } from '@/components/ui/quizcard';
import Link from 'next/link';

interface SkillAssementProps {
  title: string;
  count?: number;
  learnMoreHref: string;
}

const SkillAssement: React.FC<SkillAssementProps> = ({ title, count, learnMoreHref }) => {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="">
        <div className="grid w-full grid-cols-2 gap-4">
          <div className="text-2xl font-semibold">{count}</div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <Link href={learnMoreHref}>View More Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SkillAssement;
