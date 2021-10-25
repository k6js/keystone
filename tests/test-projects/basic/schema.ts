import { list } from '@k6js/ks-next';
import { checkbox, relationship, text, timestamp } from '@k6js/ks-next/fields';
import { select } from '@k6js/ks-next/fields';

export const lists = {
  Task: list({
    fields: {
      label: text({ validation: { isRequired: true } }),
      priority: select({
        type: 'enum',
        options: [
          { label: 'Low', value: 'low' },
          { label: 'Medium', value: 'medium' },
          { label: 'High', value: 'high' },
        ],
      }),
      isComplete: checkbox(),
      assignedTo: relationship({ ref: 'Person.tasks', many: false }),
      finishBy: timestamp(),
    },
  }),
  Person: list({
    fields: {
      name: text({ validation: { isRequired: true } }),
      tasks: relationship({ ref: 'Task.assignedTo', many: true }),
    },
  }),
  SecretPlan: list({
    fields: {
      label: text(),
      description: text(),
    },
    ui: {
      isHidden: true,
    },
  }),
};
