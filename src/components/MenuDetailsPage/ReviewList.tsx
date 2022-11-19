import {
  apiCreateReview,
  apiDeleteReview,
  apiUpdateReview,
  useApiReviewInfScroll,
} from "../../lib/api";
import { Review } from "../../lib/types";
import { InView } from "react-intersection-observer";
import styles from "./ReviewList.module.scss";
import { toast } from "react-toastify";
import Moment from "react-moment";
import "moment/locale/ko";
import { Rating } from "react-simple-star-rating";
import { useSessionContext } from "../../contexts/SessionContext";
import { FormEventHandler, useCallback, useState } from "react";
import { Modal, useModal } from "../Modal";
import DeleteModal from "./DeleteModal";
import { axiosErrorHandler } from "../../lib/error";
import { useEffectMountOrChange } from "../../lib/hooks";

export default function ReviewList({ menuId }: { menuId: number }) {
  const {
    data: reviews,
    next,
    refresh: rawRefresh,
  } = useApiReviewInfScroll(menuId, 10);
  const refresh = useCallback(() => {
    rawRefresh().catch(axiosErrorHandler("리뷰를 불러올 수 없습니다"));
  }, [rawRefresh]);
  useEffectMountOrChange(() => {
    refresh();
  }, [menuId]);
  const { withToken } = useSessionContext();
  const createReview = useCallback(
    (content: string, rating: number) => {
      withToken((token) => apiCreateReview(menuId, rating, content, token))
        .then(() => {
          refresh();
        })
        .catch(axiosErrorHandler("리뷰를 작성할 수 없습니다"));
    },
    [menuId, refresh, withToken]
  );
  const { me } = useSessionContext();
  return (
    <div className={styles.wrapper}>
      <ul className={styles.list}>
        {reviews.map((review) => (
          <ReviewDisplay
            review={review}
            key={review.id}
            refresh={() => refresh()}
          />
        ))}
        <InView
          onChange={(inView) => {
            if (inView)
              next().catch(axiosErrorHandler("리뷰를 불러올 수 없습니다"));
          }}
        />
      </ul>
      {me && <ReviewForm onSave={createReview} />}
    </div>
  );
}

function ReviewDisplay({
  review,
  refresh,
}: {
  review: Review;
  refresh: () => void;
}) {
  const { me, withToken } = useSessionContext();
  const modalHandle = useModal();
  const [isForm, setIsForm] = useState(false);
  const deleteReview = useCallback(() => {
    withToken((token) => apiDeleteReview(review.id, token))
      .then(() => {
        toast.success("리뷰를 삭제했습니다");
        return refresh();
      })
      .catch(axiosErrorHandler("리뷰를 삭제할 수 없습니다"));
  }, [refresh, review.id, withToken]);
  const updateReview = useCallback(
    (content: string, rating: number) => {
      withToken((token) => apiUpdateReview(review.id, rating, content, token))
        .then(() => {
          toast.success("리뷰를 수정했습니다");
          setIsForm(false);
          return refresh();
        })
        .catch(axiosErrorHandler("리뷰를 수정할 수 없습니다"));
    },
    [refresh, review.id, withToken]
  );
  return isForm ? (
    <ReviewForm
      onSave={updateReview}
      onCancel={() => setIsForm(false)}
      initialData={review}
    />
  ) : (
    <li>
      <span>{review.author.username}</span>
      <span>
        <Rating
          initialValue={review.rating / 2}
          size={20}
          fillColor="#F0975E"
          readonly
        />
      </span>
      <Moment element="span" fromNow locale="ko">
        {review.created_at}
      </Moment>
      {review.created_at !== review.updated_at && <span>(수정됨)</span>}
      {me?.id === review.author.id && (
        <>
          <button onClick={() => setIsForm(true)}>수정</button>
          <button onClick={() => modalHandle.openModal()}>삭제</button>
        </>
      )}
      <p>{review.content}</p>
      <Modal handle={modalHandle}>
        <DeleteModal
          title="메뉴 삭제"
          onDelete={deleteReview}
          onClose={modalHandle.closeModal}
        />
      </Modal>
    </li>
  );
}

function ReviewForm({
  onSave,
  onCancel,
  initialData,
}: {
  onSave: (content: string, rating: number) => void;
  onCancel?: () => void;
  initialData?: Review;
}) {
  const [content, setContent] = useState(initialData?.content ?? "");
  const [rating, setRating] = useState(initialData?.rating ?? 10);
  const submitReview = useCallback<FormEventHandler>(
    (e) => {
      e.preventDefault();
      onSave(content, rating);
      setContent("");
      setRating(10);
    },
    [onSave, content, rating]
  );
  return (
    <form onSubmit={submitReview}>
      <Rating
        initialValue={rating / 2}
        onClick={(value) => setRating(value * 2)}
        size={20}
        fillColor="#F0975E"
        allowFraction
      />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <button type="submit">저장</button>
      {onCancel && <button onClick={() => onCancel()}>취소</button>}
    </form>
  );
}
