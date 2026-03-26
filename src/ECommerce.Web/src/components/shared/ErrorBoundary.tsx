import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { SiteUnavailablePage } from './SiteUnavailablePage';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo): void {
        console.error('[ErrorBoundary]', error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            return <SiteUnavailablePage />;
        }
        return this.props.children;
    }
}
