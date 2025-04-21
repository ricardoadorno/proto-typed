import { useState } from "react";
import { parseInput } from "./dslParser";
import { astBuilder } from "./astBuilder";
import { astToReact } from "./astToReact";

export default function App() {
    const [input, setInput] = useState(`screen Settings:
  # User Preferences
    text Welcome to the settings panel. Here you can customize your application preferences.
  
  ### Privacy Settings
  text Configure your privacy and security options below to ensure your account remains secure.
  
  [x] Enable two-factor authentication
  [x] Backup data automatically
  [ ] Share usage statistics
    note Two-factor authentication adds an extra layer of security to your account.
  
  ### Notifications
  text Choose how you want to receive updates and alerts from the application.
  
  [x] Email notifications
  [ ] Push notifications
  [ ] Desktop alerts
  
  ### Communication  quote Your privacy matters - customize how others can interact with you.
  
  [ ] Subscribe to newsletter
  [x] Receive security alerts
  [ ] Get product updates
  
  button "Save Settings"
  
screen Profile:
  ## Profile Settings
  
  text Manage your profile settings and visibility options here.
  
  ### Account Options
  text Control what information is visible to other users.
  
  [x] Make profile public
  [ ] Show email address
  [ ] Allow messages from non-contacts
    note Making your profile public allows other users to find and connect with you.
  
  ### Data Sharing
  quote Choose what data you want to share with the community.
  
  [ ] Share activity status
  [x] Allow friend requests
  [ ] Show online status
  
  button "Update Profile"
  `);
    const [screens, setScreens] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleParse = () => {
        try {
            const screenInputs = input.split(/(?=screen\s)/);
            const parsedScreens = screenInputs
                .map(screenInput => screenInput.trim())
                .filter(Boolean)
                .map(screenInput => {
                    const cst = parseInput(screenInput);
                    return astBuilder.visit(cst);
                });

            setScreens(parsedScreens);
            setError(null);
        } catch (err: any) {
            setScreens([]);
            setError(err.message);
        }
    };

    const renderScreens = () => {
        if (screens.length === 0) return null;
        return astToReact(screens);
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>UI DSL Parser</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                    <h3>Input</h3>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        rows={10}
                        style={{ width: "100%", fontFamily: "monospace" }}
                    />
                    <div style={{ marginTop: 10 }}>
                        <button onClick={handleParse} style={{ marginRight: 10 }}>Parse</button>
                    </div>
                    {error && <pre style={{ color: "red" }}>{error}</pre>}
                </div>

                <div>
                    <h3>Screens AST Output</h3>
                    {screens.length > 0 && (
                        <pre style={{ maxHeight: 300, overflow: 'auto' }}>
                            {JSON.stringify(screens, null, 2)}
                        </pre>
                    )}
                </div>
            </div>
            <div>
                <h3>Rendered Screens</h3>
                {renderScreens()}
            </div>
        </div>
    );
}
