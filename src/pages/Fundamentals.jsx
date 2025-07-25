import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { lumaData } from './data.js';
import './Fundamentals.css';

// Reusable CodeBlock component
const CodeBlock = ({ code }) => (
    <div className="code-block">
        <pre><code>{code.trim()}</code></pre>
    </div>
);

// MindMap component for visualization
const MindMap = ({ data }) => {
    const [expandedNodes, setExpandedNodes] = useState(new Set());

    const toggleNode = (index) => {
        const newExpandedNodes = new Set(expandedNodes);
        if (newExpandedNodes.has(index)) {
            newExpandedNodes.delete(index);
        } else {
            newExpandedNodes.add(index);
        }
        setExpandedNodes(newExpandedNodes);
    };

    const numNodes = data.nodes.length;
    let nodePositions;

    // Adjust layout based on the number of nodes for a balanced look
    if (numNodes === 2) {
        nodePositions = [ { x: 20, y: 50 }, { x: 80, y: 50 } ];
    } else if (numNodes === 3) {
        nodePositions = [ { x: 50, y: 15 }, { x: 20, y: 85 }, { x: 80, y: 85 } ];
    } else { // Default to 4-node layout
        nodePositions = [ { x: 25, y: 20 }, { x: 75, y: 20 }, { x: 75, y: 80 }, { x: 25, y: 80 } ];
    }
    
    const centerPos = { x: 50, y: 50 };

    return (
        <div className="mind-map-view">
            <svg className="mind-map-svg">
                {nodePositions.map((pos, index) => (
                    <line key={index} x1={`${centerPos.x}%`} y1={`${centerPos.y}%`} x2={`${pos.x}%`} y2={`${pos.y}%`} stroke="var(--border-color)" strokeWidth="2" />
                ))}
            </svg>
            <div className="mind-map-center-node">{data.center}</div>
            {data.nodes.map((node, index) => {
                const isExpanded = expandedNodes.has(index);
                return (
                    <div key={index} className={`mind-map-node ${isExpanded ? 'expanded' : ''}`} style={{ left: `${nodePositions[index].x}%`, top: `${nodePositions[index].y}%` }}>
                        <div className="node-content">
                            <div className="node-title">{node.title}</div>
                            <div className="node-keyword"><code>{node.keyword}</code></div>
                            <div className="node-description-container"><p className="node-description">{node.description}</p></div>
                        </div>
                        <button className="node-toggle-button" onClick={() => toggleNode(index)}><i className={`fas ${isExpanded ? 'fa-minus' : 'fa-plus'}`}></i></button>
                    </div>
                );
            })}
        </div>
    );
};


export default function Fundamentals() {
    const navigate = useNavigate();
    // Default to the first sub-topic of the first main topic if it exists
    const firstTopic = lumaData.fundamentals[0];
    const initialActiveTopic = firstTopic.subTopics ? firstTopic.subTopics[0] : firstTopic;

    const [activeTopic, setActiveTopic] = useState(initialActiveTopic);
    const [viewMode, setViewMode] = useState('normal');
    // Keep track of expanded parent topics. Default the first one to be open.
    const [expandedTopics, setExpandedTopics] = useState(new Set([firstTopic.id]));

    const handleTopicClick = (topic) => {
        setActiveTopic(topic);
        setViewMode('normal'); // Reset to normal view when topic changes
    };

    const handleParentTopicClick = (topicId) => {
        const newExpanded = new Set(expandedTopics);
        if (newExpanded.has(topicId)) {
            newExpanded.delete(topicId);
        } else {
            newExpanded.add(topicId);
        }
        setExpandedTopics(newExpanded);
    };

    return (
        <div className="topic-page-container">
            <aside className="topic-sidebar">
                <button className="back-button" onClick={() => navigate('/vqm-luma-javascript/')}>
                    <i className="fas fa-arrow-left"></i> Back to Home
                </button>
                <h2>Fundamentals</h2>
                <ul className="topic-list">
                    {lumaData.fundamentals.map(topic => (
                        <React.Fragment key={topic.id}>
                            {topic.subTopics ? (
                                // This is a parent topic with sub-topics
                                <li className={`topic-list-item parent-topic ${expandedTopics.has(topic.id) ? 'expanded' : ''} ${topic.subTopics.some(sub => sub.id === activeTopic.id) ? 'parent-active' : ''}`}>
                                    <div className="parent-topic-title" onClick={() => handleParentTopicClick(topic.id)}>
                                        <span>
                                            <i className={`fas ${topic.icon}`} style={{ marginRight: '10px', width: '20px' }}></i>
                                            {topic.title}
                                        </span>
                                        <i className="fas fa-chevron-down expand-icon"></i>
                                    </div>
                                    {expandedTopics.has(topic.id) && (
                                        <ul className="sub-topic-list">
                                            {topic.subTopics.map(subTopic => (
                                                <li key={subTopic.id} className={`topic-list-item sub-topic ${activeTopic.id === subTopic.id ? 'active' : ''}`} onClick={() => handleTopicClick(subTopic)}>
                                                    <i className={`fas ${subTopic.icon}`} style={{ marginRight: '10px', width: '20px' }}></i>
                                                    {subTopic.title}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ) : (
                                // This is a regular, non-parent topic
                                <li className={`topic-list-item ${activeTopic.id === topic.id ? 'active' : ''}`} onClick={() => handleTopicClick(topic)}>
                                    <i className={`fas ${topic.icon}`} style={{ marginRight: '10px', width: '20px' }}></i>
                                    {topic.title}
                                </li>
                            )}
                        </React.Fragment>
                    ))}
                </ul>
            </aside>
            <main className="topic-content">
                <div className="topic-header">
                    <h3>{activeTopic.title}</h3>
                    {activeTopic.mindMap && (
                        <div className="view-toggle">
                            <button onClick={() => setViewMode('normal')} className={viewMode === 'normal' ? 'active' : ''}><i className="fas fa-align-left"></i> Normal</button>
                            <button onClick={() => setViewMode('mindmap')} className={viewMode === 'mindmap' ? 'active' : ''}><i className="fas fa-project-diagram"></i> Mind Map</button>
                        </div>
                    )}
                </div>
                {viewMode === 'mindmap' && activeTopic.mindMap ? <MindMap data={activeTopic.mindMap} /> : (
                    <>
                        <div dangerouslySetInnerHTML={{ __html: activeTopic.content }} />
                        {activeTopic.code && <CodeBlock code={activeTopic.code} />}
                    </>
                )}
            </main>
        </div>
    );
}
