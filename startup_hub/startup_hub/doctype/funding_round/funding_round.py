# Copyright (c) 2025, Mostafa and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class FundingRound(Document):
    def after_insert(self):
        self.update_startup_funding()
        self.create_funding_milestone()
    
    def on_update(self):
        self.update_startup_funding()
    
    def on_trash(self):
        self.update_startup_funding()
    
    def update_startup_funding(self):
        """Calculate total funding for the startup"""
        if self.startup:
            total = frappe.db.sql("""
                SELECT SUM(amount) as total, COUNT(*) as count
                FROM `tabFunding Round`
                WHERE startup = %s AND status = 'Completed'
            """, self.startup, as_dict=True)[0]
            
            frappe.db.set_value('Startup', self.startup, {
                'total_funding': total.total or 0,
                'funding_rounds_count': total.count or 0
            })
    
    def create_funding_milestone(self):
        """Auto-create milestone when funding is received"""
        if self.status == 'Completed':
            count = frappe.db.count('Funding Round', {
                'startup': self.startup,
                'status': 'Completed'
            })
            
            if count == 1:
                milestone = frappe.new_doc('Milestone')
                milestone.startup = self.startup
                milestone.title = f'First Funding Received - {self.round_type}'
                milestone.description = f'Received {self.amount} from {self.investor}'
                milestone.category = 'Funding'
                milestone.status = 'Completed'
                milestone.completed_date = self.funding_date
                milestone.insert()
                
                frappe.msgprint('🎉 Milestone created: First Funding!')