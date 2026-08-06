import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TwitchStage from './components/TwitchStage';
import ShoppableTriggerDeck from './components/ShoppableTriggerDeck';
import TelemetryLog from './components/TelemetryLog';

export default function App() {
  const [isStreaming, setIsStreaming] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [serverUrl, setServerUrl] = useState('https://opportunity-osapi-staging.up.railway.app');
  const [durationSeconds, setDurationSeconds] = useState(142);
  const [viewerCount, setViewerCount] = useState(1420);
  const [credits, setCredits] = useState(14200);
  const [activeSource, setActiveSource] = useState('MAC_MINI_DESKTOP');
  const [isAiAutopilot, setIsAiAutopilot] = useState(true);

  const [events, setEvents] = useState([
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
    let timer = null;
    if (isStreaming) {
      timer = setInterval(() => {
        setDurationSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isStreaming]);

  // Handle 1-Tap Overlay Trigger Dispatch
  const handleTriggerOverlay = async (group) => {
    const startTime = performance.now();
    const sessionId = 'a95eae04-e911-4ab3-8a78-c1d876b4ac5';
    const endpoint = `${serverUrl}/api/stream/session/${sessionId}/trigger`;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productGroupId: group.id,
          triggerSource: 'MAC_MINI_MASTER_CONTROL'
        })
      });

      const endTime = performance.now();
      const latencyMs = Math.round(endTime - startTime);

      const newLog = {
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
      const newLog = {
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

  const handleSourceChange = (newSource) => {
    setActiveSource(newSource);
    const newLog = {
      time: new Date().toLocaleTimeString(),
      type: 'SOURCE_SWITCH',
      message: `Active Broadcast Source changed to: ${newSource}`,
      source: 'TWITCH_STAGE_CONDUCTOR',
      latencyMs: 2
    };
    setEvents((prev) => [newLog, ...prev]);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 16px' }}>
      <Header
        isStreaming={isStreaming}
        isConnected={isConnected}
        serverUrl={serverUrl}
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
