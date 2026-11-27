import { motion, useReducedMotion } from "framer-motion";
import Button from "../ui/Button.jsx";

export default function AnimatedButton({
  wrapperClassName = "inline-flex",
  ...buttonProps
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={wrapperClassName}
      whileHover={reduceMotion ? undefined : { scale: 1.025 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
    >
      <Button {...buttonProps} />
    </motion.div>
  );
}
