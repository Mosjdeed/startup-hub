# Copyright (c) 2025, Mostafa and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Startup(Document):
    
    def before_save(self):
        if self.stage == "Growth" and not self.website:
            frappe.throw("Growth stage startups must have a website!")
    
    def after_insert(self):
        frappe.msgprint(f"Welcome {self.startup_name} to our incubator! 🎉")
    
    def before_delete(self):
        frappe.msgprint(f"Startup {self.startup_name} will be deleted permanently!")