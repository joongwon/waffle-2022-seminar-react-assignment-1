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
import { useSessionContext } from "../../contexts/SessionContext";
import {
  FormEventHandler,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Modal, useModal } from "../Modal";
import DeleteModal from "./DeleteModal";
import { axiosErrorHandler } from "../../lib/error";
import { useEffectMountOrChange } from "../../lib/hooks";
import Rate from "rc-rate";
import "rc-rate/assets/index.css";

export default function ReviewList({ menuId }: { menuId: number }) {
  const {
    data: reviews,
    next,
    refresh: rawRefresh,
    update,
  } = useApiReviewInfScroll(menuId, 10);
  const refresh = useCallback(() => {
    rawRefresh().catch(axiosErrorHandler("리뷰를 불러올 수 없습니다"));
  }, [rawRefresh]);
  useEffectMountOrChange(() => {
    refresh();
  }, [menuId]);
  const { withToken } = useSessionContext();
  const topRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [isNew, setIsNew] = useState(false);
  const createReview = useCallback(
    (content: string, rating: number) => {
      withToken((token) => apiCreateReview(menuId, rating, content, token))
        .then((result) => {
          if (result.canceled) return;
          toast.success("리뷰를 작성했습니다");
          return refresh();
        })
        .then(() => {
          setIsNew(true);
          setTimeout(() => setIsNew(false), 300);
        })
        .catch(axiosErrorHandler("리뷰를 작성할 수 없습니다"));
    },
    [menuId, refresh, withToken]
  );
  const { me } = useSessionContext();
  return (
    <div className={styles.wrapper}>
      <ul className={styles.list} ref={listRef}>
        <span ref={topRef} />
        {reviews.map((review, index) => (
          <ReviewDisplay
            review={review}
            key={review.id}
            updateList={update}
            isNew={index === 0 && isNew}
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

const ReviewDisplay = ({
  review,
  updateList,
  isNew,
}: {
  review: Review;
  updateList: (dispatcher: (prev: Review[]) => Review[]) => void;
  isNew: boolean;
}) => {
  const ref = useRef<HTMLLIElement>(null);
  const { me, withToken } = useSessionContext();
  const modalHandle = useModal();
  const [isForm, setIsForm] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const deleteReview = useCallback(() => {
    withToken((token) => apiDeleteReview(review.id, token))
      .then(() => {
        toast.success("리뷰를 삭제했습니다");
        setDeleted(true);
        if (ref.current) ref.current.style.height = "0";
        setTimeout(
          () => updateList((prev) => prev.filter((r) => r.id !== review.id)),
          300
        );
      })
      .catch(axiosErrorHandler("리뷰를 삭제할 수 없습니다"));
  }, [review.id, updateList, withToken]);
  const updateReview = useCallback(
    (content: string, rating: number) => {
      withToken((token) => apiUpdateReview(review.id, rating, content, token))
        .then((res) => {
          if (res.canceled) return;
          toast.success("리뷰를 수정했습니다");
          setIsForm(false);
          updateList((prev) =>
            prev.map((r) =>
              r.id === res.payload.data.id ? res.payload.data : r
            )
          );
        })
        .catch(axiosErrorHandler("리뷰를 수정할 수 없습니다"));
    },
    [review.id, updateList, withToken]
  );
  useLayoutEffect(() => {
    if (ref.current && !deleted) {
      ref.current.style.height =
        ref.current.getBoundingClientRect().height + "px";
    }
  });
  return isForm ? (
    <ReviewForm
      onSave={updateReview}
      onCancel={() => setIsForm(false)}
      initialData={review}
    />
  ) : (
    <li
      ref={ref}
      className={`${deleted ? styles.deleted : ""} ${isNew ? styles.new : ""}`}
    >
      <span>{review.author.username}</span>
      <span>
        <Rate
          value={review.rating / 2}
          disabled
          style={{ color: "#F0975E" }}
          allowHalf
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
};

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
      <Rate
        value={rating / 2}
        onChange={(v) => setRating(v * 2)}
        style={{ color: "#F0875E" }}
        allowHalf
      />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <button type="submit">저장</button>
      {onCancel && <button onClick={() => onCancel()}>취소</button>}
    </form>
  );
}
