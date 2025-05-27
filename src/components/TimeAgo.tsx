'use client'
import TimeAgoLib from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";
import ReactTimeAgo from "react-time-ago";

TimeAgoLib.addDefaultLocale(en);
TimeAgoLib.addLocale(ru);

export default function TimeAgo({ date }: { date: Date }) {
    return (
        <span>
        <ReactTimeAgo date={date} locale="en-US" />
        </span>
    );  
}