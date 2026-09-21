import { ConnectPanel } from './features/connect/ConnectPanel'
import { RawProviderPanel } from './features/connect/RawProviderPanel'
import { PortfolioPanel } from './features/portfolio/PortfolioPanel'
import { SendPanel } from './features/send/SendPanel'
import { SignInPanel } from './features/signin/SignInPanel'

function App() {
  return (
    <main>
      <header>
        <h1>lamport-lens</h1>
        <p className="muted">A devnet-only wallet dashboard. No real funds.</p>
      </header>
      <ConnectPanel />
      <RawProviderPanel />
      <PortfolioPanel />
      <SendPanel />
      <SignInPanel />
    </main>
  )
}

export default App
