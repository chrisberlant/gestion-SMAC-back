import Agent from './agent';
import Device from './device';
import Line from './line';
import Model from './model';
import Service from './service';
import User from './user';

// Relations between an agent and its lines
Agent.hasMany(Line, {
	as: 'lines',
	foreignKey: 'agentId',
});

Line.belongsTo(Agent, {
	as: 'agent',
	foreignKey: 'agentId',
});

// Relations between an agent and its devices
Agent.hasMany(Device, {
	as: 'devices',
	foreignKey: 'agentId',
});

Device.belongsTo(Agent, {
	as: 'agent',
	foreignKey: 'agentId',
});

// Relations between a service and its agents
Service.hasMany(Agent, {
	as: 'agents',
	foreignKey: { name: 'serviceId', allowNull: false },
});

Agent.belongsTo(Service, {
	as: 'service',
	foreignKey: 'serviceId',
});

// Relations between a model and its devices
Model.hasMany(Device, {
	as: 'devices',
	foreignKey: { name: 'modelId', allowNull: false },
});

Device.belongsTo(Model, {
	as: 'model',
	foreignKey: 'modelId',
});

// Relations between a device and its line
Device.hasOne(Line, {
	as: 'line',
	foreignKey: 'deviceId',
});

Line.belongsTo(Device, {
	as: 'device',
	foreignKey: 'deviceId',
});

export { User, Agent, Line, Model, Device, Service };
