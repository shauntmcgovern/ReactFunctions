import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.js";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

/*
I would like to use perhaps, a static WeatherAPI, or an API even from one of my own websites and create a PersonalPage and explain all
React Functions. So a developer can then us it for their references./{8}{9}/:'{st} Copilot{'} will be used.

React (React 18 and 19+)
<Fragment> was used to display the webpage's sections in a division and equally spaced for each subject.

{useState, useEffect}--const [data, setData] = useState([]);
                       creates a state variable in React initialized as an empty array ([])...
                       data is initialized as an empty array. You use data to read your list of items.
                       setData is a function provided by React.
                       const jsonData = await response.json();
                       setData(jsonData);
                       React replaces data with jsonData and re-renders your component.

                     --Effect was used to access the API with a username and password like other API's available it also
                     was used at the time, to display the data fetched and branched from a initial variable into a specific parsed
                     JSON data label.}, [data, ExampleAPIJSONVariable]); 

https://api.weather.gov/

{Ai/'mode}
State Hooks

• useState: Adds a local state variable to your component. Returns the current state and a function to update it.
• useReducer: Manages complex state logic using a reducer function and dispatched actions.
• useActionState (React 19): Updates component state based on the result of a form action.
• useOptimistic (React 19): Shows an optimistic, temporary UI state while an asynchronous action is still in progress.

Effect & Lifecycle Hooks

• useEffect: Runs side effects (such as data fetching, subscriptions, or manual DOM updates) after the browser paints the screen.
• useLayoutEffect: Fires synchronously after all DOM mutations, before the browser paints. Useful for measuring layout.
• useInsertionEffect: Fires before any DOM mutations, designed specifically for CSS-in-JS libraries to inject styles.

Ref Hooks

• useRef: Holds a mutable value (like a DOM node reference or timer ID) that persists across renders without triggering a re-render.
• useImperativeHandle: Customizes the instance value or methods exposed to a parent component when using ref.

Performance & Memoization Hooks

• useMemo: Caches the computed result of an expensive calculation between re-renders.//7-day forecast
• useCallback: Caches a function definition between re-renders so child components don't unnecessarily re-render.
• useTransition: Marks state updates as non-urgent transitions so the UI stays responsive during heavy renders.
• useDeferredValue: Defers updating a non-urgent part of the UI until more urgent updates finish.

Context & External Store Hooks

• useContext: Reads and subscribes to values from a React Context without prop drilling.
• useSyncExternalStore: Subscribes a component to an external, non-React data store safely.

Utility & Form Hooks

• useId: Generates unique, stable IDs for accessibility attributes (aria-describedby, htmlFor) across server and client.
• useDebugValue: Displays a custom label for custom Hooks inside React DevTools.
• useFormStatus (React DOM): Reads the pending status and submitted data of a parent <form>.

2. Built-in React Components

React includes special wrapper components that control rendering behavior without adding extra DOM elements.
• <Fragment> (<>...</>): Groups multiple child elements together without adding an extra node to the DOM.
• <StrictMode>: Enables extra development-only checks and warnings to catch potential bugs and deprecated patterns early.
• <Suspense>: Displays a fallback UI (like a loading spinner) while child components or lazy-loaded code finish loading.
• <Profiler>: Programmatically measures the rendering performance and cost of a React component tree.


3. Core React APIs

Top-level utility functions imported directly from 'react' for creating elements, managing context, and optimizing components.
• use(resource) (React 19): Reads the value of a resource like a Promise or a Context directly inside render, loops, or conditionals.
• createContext(defaultValue): Creates a Context object that components can provide and read.
• memo(Component): Wraps a component so it skips re-rendering when its props have not changed.
• lazy(loadFn): Lets you defer loading a component's code until it is rendered for the first time.
• startTransition(scope): Marks updates inside the callback as non-urgent transitions outside of a component.
• cache(fn) (React Server Components): Caches the result of a data fetch or computation per server request.
• createElement(type, props, ...children): Creates and returns a React element (what JSX compiles into under the hood).
• cloneElement(element, props, ...children): Clones an existing React element and merges in new props.
• isValidElement(object): Checks whether a given value is a valid React element.

4. React DOM APIs (react-dom & react-dom/client)

Functions used to mount React trees to the browser DOM and manage portals or resource preloading.
• createRoot(domNode): Creates a root container to render a React application inside a browser DOM element.
• hydrateRoot(domNode, reactNode): Attaches React to existing server-rendered HTML in the browser.
• createPortal(children, domNode): Renders children into a different DOM node outside the parent component's hierarchy (ideal for modals and tooltips).
• flushSync(callback): Forces React to flush any updates inside the callback synchronously and immediately update the DOM.
• preload / preinit / prefetchDNS / preconnect: Resource hints for preloading stylesheets, scripts, fonts, and external connections.


---///now that that Skill'Test is (over):0{9}:-;
*/
