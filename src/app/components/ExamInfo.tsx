"use client";

import { createStyles, Text, Card, RingProgress, Group, rem } from '@mantine/core';
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

interface CountDownProps {
  duration: number,
}

const renderTime = ({ remainingTime }: { remainingTime: number }) => {
  if (remainingTime === 0) {
    return <div className="timer">Time Up</div>;
  } else {
    const minutes = Math.floor(remainingTime / 60)
    const seconds = remainingTime % 60

    return `${minutes}:${seconds}`
  }
}


const UrgeWithPleasureComponent = ({ duration }: CountDownProps) => (
  <CountdownCircleTimer
    isPlaying
    size={150}
    strokeWidth={6}
    duration={duration}
    colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
    colorsTime={[duration / 2, duration / 4, duration / 8, duration / 10]}
    onComplete={() => {}}
  >
    {renderTime}
  </CountdownCircleTimer>
)

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },

  label: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 700,
    lineHeight: 1,
  },

  lead: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 700,
    fontSize: rem(22),
    lineHeight: 1,
  },

  inner: {
    display: 'flex',

    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column',
    },
  },

  ring: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',

    [theme.fn.smallerThan('xs')]: {
      justifyContent: 'center',
      marginTop: theme.spacing.md,
    },
  },
}));

interface StatsRingCardProps {
  title?: string;
  completed: number;
  total: number;
  stats: {
    value: number;
    label: string;
  }[];
  duration: number
}

export function ExamStats({ title, completed, total, stats, duration }: StatsRingCardProps) {
  const { classes, theme } = useStyles();
  const items = stats.map((stat) => (
    <div key={stat.label}>
      <Text className={classes.label}>{stat.value}</Text>
      <Text size="xs" color="dimmed">
        {stat.label}
      </Text>
    </div>
  ));

  return (
    <Card withBorder p="xl" radius="md" className={classes.card}>
      <div className={classes.inner}>
        <div>
          <Text fz="xl" className={classes.label}>
            {title}
          </Text>
          <div>
            <Text className={classes.lead} mt={30}>
              {completed}
            </Text>
            <Text fz="xs" color="dimmed">
              Completed
            </Text>
          </div>
          <Group mt="lg">{items}</Group>
        </div>

        <div className={classes.ring}>
          <UrgeWithPleasureComponent duration={duration * 60} />
        </div>
      </div>
    </Card>
  );
}