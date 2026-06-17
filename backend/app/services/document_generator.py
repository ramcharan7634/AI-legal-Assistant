from typing import Dict, Any
from datetime import datetime, timedelta


class DocumentGeneratorService:
    """Service for generating legal documents."""
    
    def generate_rental_agreement(self, data: Dict[str, Any]) -> str:
        """
        Generate a rental agreement.
        
        Args:
            data: Dictionary containing:
                - landlord_name: Name of the landlord
                - tenant_name: Name of the tenant
                - property_address: Address of the property
                - rent_amount: Monthly rent amount
                - security_deposit: Security deposit amount
                - duration_months: Lease duration in months
                - start_date: Start date of the lease
                
        Returns:
            Generated rental agreement text
        """
        landlord = data.get("landlord_name", "[LANDLORD NAME]")
        tenant = data.get("tenant_name", "[TENANT NAME]")
        address = data.get("property_address", "[PROPERTY ADDRESS]")
        rent = data.get("rent_amount", "[RENT AMOUNT]")
        deposit = data.get("security_deposit", "[SECURITY DEPOSIT]")
        duration = data.get("duration_months", 12)
        start_date = data.get("start_date", datetime.now().strftime("%Y-%m-%d"))
        
        # Calculate end date
        start = datetime.strptime(start_date, "%Y-%m-%d")
        end = start + timedelta(days=duration * 30)
        end_date = end.strftime("%Y-%m-%d")
        
        agreement = f"""
RESIDENTIAL LEASE AGREEMENT

This Lease Agreement ("Agreement") is entered into on {start_date} ("Effective Date")

BETWEEN:
Landlord: {landlord} ("Landlord")
Tenant: {tenant} ("Tenant")

PROPERTY:
The Landlord agrees to rent to the Tenant the property located at: {address}

TERM:
This lease shall commence on {start_date} and shall terminate on {end_date}.
The term of this lease is {duration} months.

RENT:
The Tenant agrees to pay the Landlord a monthly rent of ${rent}.
Rent is due on the 1st day of each month.
Late payment will incur a fee of 5% of the monthly rent.

SECURITY DEPOSIT:
The Tenant shall pay a security deposit of ${deposit}.
This deposit will be held by the Landlord as security for the performance of this Agreement.
The deposit shall be returned to the Tenant within 30 days of the lease termination, less any deductions for damages or unpaid rent.

UTILITIES:
The Tenant shall be responsible for all utilities including electricity, gas, water, sewer, trash collection, telephone, cable, and internet services.

MAINTENANCE AND REPAIRS:
The Tenant shall maintain the premises in a clean and sanitary condition.
The Landlord shall be responsible for major repairs and structural maintenance.
The Tenant shall report any damage or needed repairs promptly to the Landlord.

USE OF PROPERTY:
The premises shall be used solely for residential purposes.
The Tenant shall not sublet or assign the premises without written consent from the Landlord.

PETS:
No pets shall be allowed on the premises without prior written consent from the Landlord.

TERMINATION:
Either party may terminate this Agreement with 30 days written notice.
If the Tenant terminates early, the Tenant shall forfeit the security deposit.

RIGHT OF ENTRY:
The Landlord shall have the right to enter the premises with reasonable notice (at least 24 hours) for inspections or repairs.

GOVERNING LAW:
This Agreement shall be governed by and construed in accordance with the laws of the state where the property is located.

ENTIRE AGREEMENT:
This Agreement constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, or agreements.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.

_________________________          _________________________
Landlord: {landlord}               Date

_________________________          _________________________
Tenant: {tenant}                  Date
"""
        return agreement.strip()
    
    def generate_nda(self, data: Dict[str, Any]) -> str:
        """
        Generate a Non-Disclosure Agreement (NDA).
        
        Args:
            data: Dictionary containing:
                - disclosing_party: Name of the disclosing party
                - receiving_party: Name of the receiving party
                - purpose: Purpose of the disclosure
                - duration_years: Duration of the NDA in years
                - effective_date: Effective date of the NDA
                
        Returns:
            Generated NDA text
        """
        disclosing = data.get("disclosing_party", "[DISCLOSING PARTY]")
        receiving = data.get("receiving_party", "[RECEIVING PARTY]")
        purpose = data.get("purpose", "[PURPOSE]")
        duration = data.get("duration_years", 2)
        effective_date = data.get("effective_date", datetime.now().strftime("%Y-%m-%d"))
        
        agreement = f"""
NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into on {effective_date} ("Effective Date")

BETWEEN:
Disclosing Party: {disclosing} ("Disclosing Party")
Receiving Party: {receiving} ("Receiving Party")

RECITALS:
The Disclosing Party possesses certain confidential and proprietary information.
The Receiving Party desires to receive certain confidential information for the purpose of {purpose}.
The parties wish to protect the confidentiality of such information.

1. DEFINITION OF CONFIDENTIAL INFORMATION:
"Confidential Information" means any and all information or data disclosed by the Disclosing Party to the Receiving Party, whether orally, in writing, or by any other means, that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and circumstances of disclosure.

2. OBLIGATIONS OF RECEIVING PARTY:
The Receiving Party agrees to:
a) Hold the Confidential Information in strict confidence
b) Not disclose the Confidential Information to any third parties without prior written consent
c) Use the Confidential Information solely for the Purpose stated above
d) Protect the Confidential Information with at least the same degree of care used to protect its own confidential information

3. EXCLUSIONS:
This Agreement does not apply to information that:
a) Is or becomes publicly available through no fault of the Receiving Party
b) Was properly in the possession of the Receiving Party prior to disclosure
c) Is independently developed by the Receiving Party without use of Confidential Information
d) Is disclosed with the written approval of the Disclosing Party

4. TERM:
This Agreement shall remain in effect for {duration} years from the Effective Date.
The obligations of confidentiality shall survive termination of this Agreement.

5. RETURN OF MATERIALS:
Upon termination or upon request, the Receiving Party shall promptly return or destroy all materials containing Confidential Information.

6. NO LICENSE:
Nothing in this Agreement grants any license or rights to any patents, copyrights, trademarks, or other intellectual property rights.

7. REMEDIES:
The Receiving Party acknowledges that any breach of this Agreement may cause irreparable harm, and the Disclosing Party shall be entitled to seek equitable relief, including injunction and specific performance.

8. GOVERNING LAW:
This Agreement shall be governed by and construed in accordance with applicable laws.

9. ENTIRE AGREEMENT:
This Agreement constitutes the entire agreement between the parties concerning the subject matter hereof and supersedes all prior agreements and understandings.

10. AMENDMENTS:
This Agreement may not be amended except by a written instrument signed by both parties.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.

_________________________          _________________________
Disclosing Party: {disclosing}    Date

_________________________          _________________________
Receiving Party: {receiving}      Date
"""
        return agreement.strip()


# Singleton instance
document_generator_service = DocumentGeneratorService()

