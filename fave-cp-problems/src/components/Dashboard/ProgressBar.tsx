
interface ProgressBarProps {
    min: number,
    max: number, 
    width: number,
    text: React.ReactNode
}

const ProgressBar = (props: ProgressBarProps) => {


    return (
      <div className="progress">
        <div
          className="progress-bar"
          role="progressbar"
          aria-label="Example with label"
          style={{ width: `${props.width}%` }}
          aria-valuenow={props.width}
          aria-valuemin={props.min}
          aria-valuemax={props.max}
        >
          {props.text}
        </div>
      </div>
    );
}

export default ProgressBar