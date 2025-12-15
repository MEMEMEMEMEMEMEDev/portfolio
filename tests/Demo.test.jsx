import {
  useState,
  useEffect,
  useContext,
  useReducer,
  createContext,
} from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

const mockFetch = jest.fn(() =>
  Promise.resolve({ json: () => Promise.resolve({ data: "Hello, World!" }) }),
);
const mockStore = { getState: () => ({ message: "Hello from store" }) };
const mockDispatch = jest.fn();
const mockUseSelector = jest.fn((selector) => selector(mockStore.getState()));
const mockUseDispatch = jest.fn(() => mockDispatch);

const DemoContext = createContext({ value: "" });
const DemoProvider = ({ children }) => (
  <DemoContext.Provider value={{ value: "context value" }}>
    {children}
  </DemoContext.Provider>
);

const reducer = (state, action) => {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    default:
      return state;
  }
};

const TestComponent = () => {
  const [state, setState] = useState("initial");
  const [reducerState, dispatch] = useReducer(reducer, { count: 0 });
  const context = useContext(DemoContext);
  const [data, setData] = useState(null);

  useEffect(() => {
    mockFetch()
      .then((res) => res.json())
      .then((json) => setData(json.data));
  }, []);

  return (
    <div>
      <div data-testid="state">{state}</div>
      <div data-testid="reducer">{reducerState.count}</div>
      <div data-testid="context">{context.value}</div>
      {data && <div data-testid="data">{data}</div>}
      <button onClick={() => setState("changed")}>Change State</button>
      <button onClick={() => dispatch({ type: "increment" })}>Increment</button>
    </div>
  );
};

const ReduxMockComponent = () => {
  const selectedValue = mockUseSelector((state) => state.message);
  const dispatch = mockUseDispatch();

  return (
    <div>
      <div data-testid="selected">{selectedValue}</div>
      <button onClick={() => dispatch({ type: "TEST_ACTION" })}>
        Dispatch
      </button>
    </div>
  );
};

describe("demo test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders initial state and fetches data", async () => {
    render(
      <DemoProvider>
        <TestComponent />
      </DemoProvider>,
    );
    expect(screen.getByTestId("state")).toHaveTextContent("initial");
    expect(screen.getByTestId("reducer")).toHaveTextContent("0");
    expect(screen.getByTestId("context")).toHaveTextContent("context value");

    const dataElement = await screen.findByTestId("data");
    expect(dataElement).toHaveTextContent("Hello, World!");
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  test("updates state on button click", async () => {
    render(
      <DemoProvider>
        <TestComponent />
      </DemoProvider>,
    );
    fireEvent.click(screen.getByText("Change State"));
    expect(screen.getByTestId("state")).toHaveTextContent("changed");
    await screen.findByTestId("data");
  });

  test("updates reducer state on button click", async () => {
    render(
      <DemoProvider>
        <TestComponent />
      </DemoProvider>,
    );
    fireEvent.click(screen.getByText("Increment"));
    expect(screen.getByTestId("reducer")).toHaveTextContent("1");
    await screen.findByTestId("data");
  });

  test("uses mockUseSelector and mockUseDispatch", () => {
    render(<ReduxMockComponent />);
    expect(screen.getByTestId("selected")).toHaveTextContent(
      "Hello from store",
    );
    fireEvent.click(screen.getByText("Dispatch"));
    expect(mockDispatch).toHaveBeenCalledWith({ type: "TEST_ACTION" });
  });
});
