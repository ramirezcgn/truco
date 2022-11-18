import React from "react";
import cx from 'classnames'
import styles from './Cards.module.scss';

type Props = {
  number: number;
  suits: string;
}

export const Card = ({
  number,
  suits,
}: Props) => (
  <div className={cx(styles.card, styles[suits], styles[`${suits}--n${number}`])} />
)
