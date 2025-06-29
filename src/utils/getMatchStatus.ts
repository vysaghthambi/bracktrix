import { Match } from "@prisma/client";
import dayjs from "dayjs";

export const getMatchStatus = (match: Match) => {
  const isScheduled = match.status === "SCHEDULED";
  const isFirstHalf =
    match.status === "ONGOING" &&
    match.firstHalfStartAt &&
    !match.firstHalfEndAt;
  const isHalfTime =
    match.status === "ONGOING" &&
    match.firstHalfEndAt &&
    !match.secondHalfStartAt;
  const isSecondHalf =
    match.status === "ONGOING" &&
    match.secondHalfStartAt &&
    !match.secondHalfEndAt;
  const isFullTime =
    match.status === "ONGOING" &&
    match.secondHalfEndAt &&
    !match.extraFirstHalfStartAt;
  const isExtraFirstHalf =
    match.status === "ONGOING" &&
    match.extraFirstHalfStartAt &&
    !match.extraFirstHalfEndAt;
  const isExtraFirstHalfEnd =
    match.status === "ONGOING" &&
    match.extraFirstHalfEndAt &&
    !match.extraSecondHalfStartAt;
  const isExtraSecondHalf =
    match.status === "ONGOING" &&
    match.extraSecondHalfStartAt &&
    !match.extraSecondHalfEndAt;
  const isExtraSecondHalfEnd =
    match.status === "ONGOING" && match.extraSecondHalfEndAt;
  const isMatchCompleted = match.status === "COMPLETED";

  return {
    isScheduled,
    isFirstHalf,
    isHalfTime,
    isSecondHalf,
    isFullTime,
    isExtraFirstHalf,
    isExtraFirstHalfEnd,
    isExtraSecondHalf,
    isExtraSecondHalfEnd,
    isMatchCompleted,
  };
};

export const getCurrentTime = (match: Match) => {
  const { isFirstHalf, isSecondHalf, isExtraFirstHalf, isExtraSecondHalf } =
    getMatchStatus(match);

  let currentTime = 1;

  if (isFirstHalf) {
    currentTime = dayjs().diff(dayjs(match.firstHalfStartAt), "minute") + 1;
  } else if (isSecondHalf) {
    currentTime =
      Math.floor(match.duration / 2) +
      dayjs().diff(dayjs(match.secondHalfStartAt), "minute") +
      1;
  } else if (isExtraFirstHalf) {
    currentTime =
      match.duration +
      dayjs().diff(dayjs(match.extraFirstHalfStartAt), "minute") +
      1;
  } else if (isExtraSecondHalf) {
    currentTime =
      match.duration +
      dayjs(match.extraFirstHalfEndAt).diff(
        dayjs(match.extraFirstHalfStartAt),
        "minute"
      ) +
      dayjs().diff(dayjs(match.extraSecondHalfStartAt), "minute") +
      1;
  }

  return currentTime;
};
