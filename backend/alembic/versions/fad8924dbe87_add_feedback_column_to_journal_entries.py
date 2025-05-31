"""add feedback column to journal_entries

Revision ID: fad8924dbe87
Revises: 596b63e7f2f0
Create Date: 2025-05-31 14:42:20.488114
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'fad8924dbe87'
down_revision: Union[str, None] = '596b63e7f2f0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('journal_entries', sa.Column('feedback', sa.String(), nullable=True))

def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('journal_entries', 'feedback')