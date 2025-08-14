import { useState, useEffect } from "react";
import { toEthiopian, toGregorian } from "ethiopian-calendar-new";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, PartyPopper } from "lucide-react";

interface EthiopianDate {
  day: number;
  month: number;
  year: number;
}

interface Holiday {
  month: number;
  day: number;
  name: string;
}

const monthsAmharic: string[] = [
  "መስከረም", "ጥቅምት", "ህዳር", "ታህሳስ", "ጥር", "የካቲት", "መጋቢት",
  "ሚያዝያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜ"
];

const daysAmharic: string[] = [
  "እሁድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "አርብ", "ቅዳሜ"
];

const ethiopianPublicHolidays: Holiday[] = [
  { month: 1, day: 1, name: "እንቁጣጣሽ (Ethiopian New Year)" },
  { month: 1, day: 17, name: "መስቀል (Finding of the True Cross)" },
  { month: 3, day: 10, name: "የኢድ አል ፈጥር በዓል (Eid al-Fitr)" },
  { month: 3, day: 17, name: "የኢድ አል አድሃ በዓል (Eid al-Adha)" },
  { month: 4, day: 7, name: "የገና በዓል (Christmas)" },
  { month: 5, day: 11, name: "ጥምቀት (Epiphany)" },
  { month: 7, day: 2, name: "የአድዋ ድል ቀን (Adwa Victory Day)" },
  { month: 7, day: 20, name: "የፋሲካ በዓል (Ethiopian Easter)" },
  { month: 9, day: 1, name: "የሰራተኞች ቀን (Labour Day)" },
];

const Calendar = () => {
  const [currentEthDate, setCurrentEthDate] = useState<EthiopianDate>({ day: 0, month: 0, year: 0 });
  const [displayMonth, setDisplayMonth] = useState<number>(0);
  const [displayYear, setDisplayYear] = useState<number>(0);

  useEffect(() => {
    const now = new Date();
    const eth: EthiopianDate = toEthiopian(now.getFullYear(), now.getMonth() + 1, now.getDate());
    setCurrentEthDate(eth);
    
    if (!displayMonth) {
      setDisplayMonth(eth.month);
      setDisplayYear(eth.year);
    }
  }, [displayMonth]);

  const getDaysInEthMonth = (year: number, month: number): number => (month === 13 ? (year % 4 === 3 ? 6 : 5) : 30);

  const changeMonth = (direction: number): void => {
    let newMonth: number = displayMonth + direction;
    let newYear: number = displayYear;

    if (newMonth > 13) {
      newMonth = 1;
      newYear += 1;
    } else if (newMonth < 1) {
      newMonth = 13;
      newYear -= 1;
    }

    setDisplayMonth(newMonth);
    setDisplayYear(newYear);
  };

  const renderMonthDays = (): JSX.Element[] => {
    const days: JSX.Element[] = [];
    const totalDays: number = getDaysInEthMonth(displayYear, displayMonth);

    const gregFirst = toGregorian(displayYear, displayMonth, 1);
    const firstDate = new Date(gregFirst.year, gregFirst.month - 1, gregFirst.day);
    const firstDayOfWeek: number = firstDate.getDay();

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-start-${i}`} className="p-2"></div>);
    }

    for (let i = 1; i <= totalDays; i++) {
      const isCurrentDay: boolean = i === currentEthDate.day && 
                                   displayMonth === currentEthDate.month && 
                                   displayYear === currentEthDate.year;
      const isHoliday: boolean = ethiopianPublicHolidays.some(
        (h: Holiday) => h.month === displayMonth && h.day === i
      );
      
      let dayClass: string = "bg-white text-gray-800 border-gray-200 hover:bg-gray-50";
      if (isCurrentDay) {
        dayClass = "bg-gradient-to-r from-teal-400 via-green-500 to-emerald-600 text-white font-bold border-emerald-700 shadow-lg scale-105";
      } else if (isHoliday) {
        dayClass = "bg-lime-50 text-lime-800 font-semibold border-lime-200 hover:bg-lime-100";
      }
      
      const holidayName: string = isHoliday ? 
        ethiopianPublicHolidays.find((h: Holiday) => h.month === displayMonth && h.day === i)?.name || '' : '';

      days.push(
        <div
          key={i}
          className={`relative flex flex-col items-center justify-center p-2 text-center rounded-lg border transform transition-all duration-300 hover:scale-105 ${dayClass}`}
          title={holidayName}
        >
          <span className="text-xl">{i}</span>
          {isHoliday && <PartyPopper className="absolute bottom-1 right-1 h-3 w-3 text-lime-500" />}
          {isCurrentDay && (
            <span className="absolute top-0 left-0 w-2 h-2 bg-white rounded-full"></span>
          )}
        </div>
      );
    }

    return days;
  };

  const renderHolidays = (): JSX.Element => {
    const monthHolidays: Holiday[] = ethiopianPublicHolidays.filter(h => h.month === displayMonth);
    return monthHolidays.length > 0 ? (
      <ScrollArea className="h-40 w-full">
        <ul className="space-y-3">
          {monthHolidays.map((holiday, index) => (
            <li key={index} className="flex items-center text-base text-gray-700 p-2 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100">
              <PartyPopper className="mr-3 text-2xl text-lime-500" />
              <span>
                <strong className="text-green-700">{holiday.day} {monthsAmharic[holiday.month - 1]}</strong> - {holiday.name}
              </span>
            </li>
          ))}
        </ul>
      </ScrollArea>
    ) : (
      <p className="text-gray-600">ለዚህ ወር ምንም በዓላት የሉም (No holidays this month)</p>
    );
  };

  return (
    <div className="flex flex-col gap-8 max-w-lg mx-auto mt-8 p-6">
      <Card className="flex-1 bg-white bg-opacity-90 backdrop-blur-md shadow-xl rounded-2xl border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between p-6">
          <Button variant="ghost" onClick={() => changeMonth(-1)}>
            <ChevronLeft className="h-6 w-6 text-green-700" />
          </Button>
          <CardTitle className="text-3xl font-extrabold text-green-800 text-center">
            {monthsAmharic[displayMonth - 1]} {displayYear}
          </CardTitle>
          <Button variant="ghost" onClick={() => changeMonth(1)}>
            <ChevronRight className="h-6 w-6 text-green-700" />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-7 gap-2 mb-6">
            {daysAmharic.map((day, index) => (
              <div key={index} className="text-center font-extrabold text-sm text-gray-500 uppercase">
                {day.slice(0, 2)}
              </div>
            ))}
            {renderMonthDays()}
          </div>
          <div className="mt-auto pt-6 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-green-800 mb-4">የኢትዮጵያ በዓላት (Holidays)</h3>
            {renderHolidays()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Calendar;
