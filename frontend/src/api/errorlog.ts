type Error = { [key: string]: any };
type Handler = (errors: Error[]) => void;

class ErrorLog {
  list: Error[] = [];

  subscribers: Handler[] = [];

  subscribe(func: Handler) {
    this.subscribers.push(func);
  }

  log(error: Error) {
    this.list.push(error);
    this.subscribers.forEach((func) => func(this.list));
  }
}

export const Errors = new ErrorLog();
export default Errors;
