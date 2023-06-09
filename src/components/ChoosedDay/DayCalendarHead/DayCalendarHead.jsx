import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  WeekInfoWrapper,
  DayOfWeek,
  DateWrapper,
  DateContainer,
} from './DayCalendarHead.styled';
import { format } from 'date-fns';

const chooseIndexOfCurrentDay = date => {
  switch (date.toString().slice(0, 3).toUpperCase()) {
    case 'MON':
      return 0;
    case 'TUE':
      return 1;
    case 'WED':
      return 2;
    case 'THU':
      return 3;
    case 'FRI':
      return 4;
    case 'SAT':
      return 5;
    case 'SUN':
      return 6;
    default:
      return 0;
  }
};
const dateParts = currentDay =>
  currentDay !== ':currentDay'
    ? currentDay.split('-')
    : format(new Date(), 'yyyy-MM-dd').split('-');

export function DayCalendarHead({ clickChooseDay }) {
  const navigate = useNavigate();
  const { currentDay } = useParams();

  const year = dateParts(currentDay)[0];
  const month = dateParts(currentDay)[1] - 1;
  const dayFromParams = dateParts(currentDay)[2];
  

  const currentDate = new Date(year, month, dayFromParams);

  const [choosedDay, setChoosedDay] = useState(dayFromParams);

  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  const handleClickDay = (day, dayValue, monthValue, yearValue) => {
    const dateClickObject = {
      weekDay: day,
      day: dayValue,
      month: monthValue,
      year: yearValue,
    };
    setChoosedDay(dayValue);
    clickChooseDay(dateClickObject);
  };

  useEffect(() => {
setChoosedDay(dayFromParams);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDay]);

  const weekInfoWrappers = useMemo(
    () =>
      daysOfWeek.map((day, index) => {
        const date = new Date(year, month, dayFromParams);

        const currentDay = index % 7;

        date.setDate(
          currentDate.getDate() + currentDay - chooseIndexOfCurrentDay(date)
        );

        const dayOfWeek = date.toString().slice(0, 3).toUpperCase();
        const dayValue = String(date.getDate()).padStart(2, '0');
        const monthValue = String(date.getMonth() + 1).padStart(2, '0');
        const yearValue = String(date.getFullYear());

        const dateKey = `${day}-${dayValue}-${monthValue}-${yearValue}`;

        const isCurrentDay = date.toDateString().slice(8, 10) === choosedDay;

        return (
          <WeekInfoWrapper key={dateKey}>
            <DayOfWeek key={dayOfWeek}>{dayOfWeek}</DayOfWeek>
            <DateContainer
              key={dateKey}
              onClick={() => {
                handleClickDay(day, dayValue, monthValue, yearValue);
                navigate(
                  `/calendar/day/${yearValue}-${monthValue}-${dayValue}`
                );
              }}
              style={{
                backgroundColor: isCurrentDay ? 'var(--accent)' : 'inherit',
                color: isCurrentDay ? 'var(--btn-text-color)' : 'inherit',
              }}
            >
              <p>{dayValue}</p>
            </DateContainer>
          </WeekInfoWrapper>
        );
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
    [daysOfWeek, currentDate, currentDay, chooseIndexOfCurrentDay]
  );

  return (
    <Container>
      <DateWrapper>{weekInfoWrappers}</DateWrapper>
    </Container>
  );
}
