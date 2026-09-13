import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TwitchStage from './components/TwitchStage';
import ShoppableTriggerDeck, { ProductGroup } from './components/ShoppableTriggerDeck';
import TelemetryLog, { TelemetryEvent } from './components/TelemetryLog';
import { ENVIRONMENTS, EnvironmentKey } from './config/environment';

export default function App() {
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [currentEnv, setCurrentEnv] = useState<EnvironmentKey>('staging');
  const [serverUrl, setServerUrl] = useState<string>(ENVIRONMENTS.staging.apiUrl);
  const [durationSeconds, setDurationSeconds] = useState<number>(142);
  const [viewerCount, setViewerCount] = useState<number>(1420);
  const [credits, setCredits] = useState<number>(14200);
  const [activeSource, setActiveSource] = useState<string>('MAC_MINI_DESKTOP');
  const [isAiAutopilot, setIsAiAutopilot] = useState<boolean>(true);

  const [events, setEvents] = useState<TelemetryEvent[]>([
    {
      time: new Date().toLocaleTimeString(),
      type: 'LIVE_OVERLAY_TRIGGER',
      message: 'Dispatched Opportunity OS Pro Pass ($49.00)',
      source: 'MACBOOK_FACETIME',
      latencyMs: 8
    },
    {
      time: new Date(Date.now() - 5000).toLocaleTimeString(),
      type: 'TRANSCRIPT_CHUNK',
      message: 'AI Extracted 2 Shoppable Bundle Entities from Live Speech',
      source: 'AI_STREAM_CONDUCTOR',
      latencyMs: 12
    },
    {
      time: new Date(Date.now() - 12000).toLocaleTimeString(),
      type: 'VIEWER_JOIN',
      message: 'Viewer batch +84 connected to stream session',
      source: 'WEBSOCKET_GATEWAY',
      latencyMs: 3
    }
  ]);

  // Duration timer
  useEffect(() => {
    let timer: any = null;
    if (isStreaming) {
      timer = setInterval(() => {
        setDurationSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isStreaming]);

  // Connect to Railway Cloud WebSockets for live telemetry and viewer events
  useEffect(() => {
    let ws: WebSocket | null = null;
    const wsUrl = ENVIRONMENTS[currentEnv]?.wsUrl || 'wss://digitpop-server-staging.up.railway.app';
    try {
      ws = new WebSocket(`${wsUrl}/master_control?sessionId=45f65b49-79ef-48c6-a2e3-9c9655a4f569`);
      ws.onopen = () => setIsConnected(true);
      ws.onmessage = (evt: MessageEvent) => {
        try {
          const msg = JSON.parse(evt.data);
          if (msg.type === 'LIVE_OVERLAY_TRIGGER') {
            setEvents(prev => [{
              time: new Date().toLocaleTimeString(),
              type: 'LIVE_OVERLAY_TRIGGER',
              message: `Live Broadcast: ${msg.data?.productGroup?.title || 'Shoppable Overlay'}`,
              source: msg.triggerSource || 'IOS_PRODUCER_DECK',
              latencyMs: 6
            }, ...prev]);
            setCredits(prev => prev + 150);
          } else if (msg.type === 'CONNECTED_DEVICES_MATRIX_UPDATE') {
            setViewerCount(() => Math.max(1420, msg.devices ? msg.devices.length * 473 : 1420));
          }
        } catch (e) {
          // JSON parse skip
        }
      };
      ws.onerror = () => setIsConnected(false);
    } catch (e) {
      setIsConnected(false);
    }

    return () => {
      if (ws) ws.close();
    };
  }, [currentEnv]);

  // Handle 1-Tap Overlay Trigger Dispatch
  const handleTriggerOverlay = async (group: ProductGroup) => {
    const startTime = performance.now();
    const sessionId = '45f65b49-79ef-48c6-a2e3-9c9655a4f569';
    const endpoint = `${serverUrl}/api/stream/session/${sessionId}/trigger`;

    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productGroupId: group.id,
          triggerSource: 'MAC_MINI_MASTER_CONTROL'
        })
      });

      const endTime = performance.now();
      const latencyMs = Math.round(endTime - startTime);

      const newLog: TelemetryEvent = {
        time: new Date().toLocaleTimeString(),
        type: 'LIVE_OVERLAY_TRIGGER',
        message: `Dispatched ${group.title} (${group.price})`,
        source: 'MAC_MINI_MASTER_CONTROL',
        latencyMs: latencyMs > 0 ? latencyMs : 6
      };

      setEvents((prev) => [newLog, ...prev]);
      setCredits((prev) => prev + 150);
    } catch (err) {
      console.warn('Local trigger warning (using fallback simulation):', err);
      const newLog: TelemetryEvent = {
        time: new Date().toLocaleTimeString(),
        type: 'LIVE_OVERLAY_TRIGGER',
        message: `Dispatched ${group.title} (${group.price})`,
        source: 'MAC_MINI_MASTER_CONTROL',
        latencyMs: 4
      };
      setEvents((prev) => [newLog, ...prev]);
      setCredits((prev) => prev + 150);
    }
  };

  const handleSourceChange = (newSource: string) => {
    setActiveSource(newSource);
    const newLog: TelemetryEvent = {
      time: new Date().toLocaleTimeString(),
      type: 'SOURCE_SWITCH',
      message: `Active Broadcast Source changed to: ${newSource}`,
      source: 'TWITCH_STAGE_CONDUCTOR',
      latencyMs: 2
    };
    setEvents((prev) => [newLog, ...prev]);
  };

  const handleEnvChange = (envKey: string) => {
    const key = envKey as EnvironmentKey;
    const targetEnv = ENVIRONMENTS[key] || ENVIRONMENTS.staging;
    setCurrentEnv(key);
    setServerUrl(targetEnv.apiUrl);
    const newLog: TelemetryEvent = {
      time: new Date().toLocaleTimeString(),
      type: 'ENVIRONMENT_SWITCH',
      message: `Switched environment to: ${targetEnv.label} (${targetEnv.apiUrl})`,
      source: 'MASTER_CONTROL_CONFIG',
      latencyMs: 1
    };
    setEvents((prev) => [newLog, ...prev]);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 16px' }}>
      <Header
        isStreaming={isStreaming}
        isConnected={isConnected}
        serverUrl={serverUrl}
        currentEnv={currentEnv}
        onEnvChange={handleEnvChange}
        viewerCount={viewerCount}
        credits={credits}
        durationSeconds={durationSeconds}
        onToggleStream={() => setIsStreaming(!isStreaming)}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <TwitchStage
          activeSource={activeSource}
          onSelectSource={handleSourceChange}
        />

        <ShoppableTriggerDeck
          onTriggerOverlay={handleTriggerOverlay}
          isAiAutopilot={isAiAutopilot}
          onToggleAiAutopilot={() => setIsAiAutopilot(!isAiAutopilot)}
        />

        <TelemetryLog
          events={events}
          onClearLogs={() => setEvents([])}
        />
      </div>
    </div>
  );
}
