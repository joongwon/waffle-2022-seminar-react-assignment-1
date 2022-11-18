import { useApiReviewInfScroll } from "../../lib/api";
import { Review } from "../../lib/types";
import { InView } from "react-intersection-observer";
import styles from "./ReviewList.module.scss";
import axios from "axios";
import { toast } from "react-toastify";
import Moment from "react-moment";
import "moment/locale/ko";
import StarRatings from "react-star-ratings";

export default function ReviewList({ menuId }: { menuId: number }) {
  const { data: reviews, next } = useApiReviewInfScroll(menuId, 10);
  return (
    <ul className={styles.list}>
      {reviews.map((review) => (
        <ReviewDisplay review={review} key={review.id} />
      ))}
      <InView
        onChange={(inView) => {
          if (inView)
            next().catch((err) => {
              const message =
                axios.isAxiosError(err) && err.response?.data.message;
              toast.error(message ?? "리뷰를 불러올 수 없습니다");
            });
        }}
      />
    </ul>
  );
}

function ReviewDisplay({ review }: { review: Review }) {
  return (
    <li>
      <span>{review.author.username}</span>
      <span>
        <StarRatings
          rating={review.rating / 2}
          starDimension="15px"
          starSpacing="0"
          starRatedColor="#F0975E"
        />
      </span>
      <Moment element="span" fromNow locale="ko">
        {review.created_at}
      </Moment>
      <p>{review.content}</p>
    </li>
  );
}
