import React, { useState } from "react";
import "./skeleton-styles.scss";
import { SkeletonProps } from "../../models/components";

const Skeleton: React.FC<SkeletonProps> = ({ onDrop }) => {
  const [showSkeleton, setShowSkeleton] = useState(false);
  return (
    <div
      onDragEnter={() => {
        setShowSkeleton(true);
      }}
      onDragLeave={() => setShowSkeleton(false)}
      onDrop={() => {
        onDrop?.();
        setShowSkeleton(false);
      }}
      onDragOver={(e) => e.preventDefault()}
      className={showSkeleton ? "skeleton-card" : "hide-skeleton-card"}
    >
      Drop here
    </div>
  );
};

export default Skeleton;
