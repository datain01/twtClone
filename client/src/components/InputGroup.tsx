import cls from "classnames"

interface InputGroupProps {
    className?: string;
    type?: string;
    placeholder?: string;
    value: string;
    error: string | undefined;
    setValue: (str: string) => void; //setValue 함수를 정의, 
    // 매개변수는 string type이고 반환값이 없음
}

//React.FC<InputGroupProps>는 React의 함수형 컴포넌트 정의하는 타입
const InputGroup: React.FC<InputGroupProps> = ({ 
    className = "mb-3", type = "text", placeholder="", value, error, setValue 
}) => {
    return (
        <div className="form-floating">
        <div className={className}>
            <div className="input-group">
                <span className="input-group-text" id="inputGroup-sizing-default"></span>
                <input type={type}
                className={cls(
                    'form-control transition-all duration-200 rounded',
                    { 'is-invalid': error }
                )}
                placeholder={placeholder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                />

                {error && <div className="invalid-feedback">{error}</div>}
            </div>
            </div>
        </div>
    )

    }
    export default InputGroup;