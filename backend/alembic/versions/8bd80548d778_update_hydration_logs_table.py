"""Update hydration_logs table

Revision ID: 8bd80548d778
Revises: 3ced89579332
Create Date: 2025-09-01 15:29:25.461902

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '8bd80548d778'
down_revision: Union[str, Sequence[str], None] = '3ced89579332'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    with op.batch_alter_table("hydration_logs", schema=None) as batch_op:
        # ensure daily_goal is NOT NULL
        batch_op.alter_column(
            "daily_goal",
            existing_type=sa.INTEGER(),
            nullable=False
        )

        # drop old column if it still exists
        batch_op.drop_column("glasses_drunk")


def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table("hydration_logs", schema=None) as batch_op:
        batch_op.add_column(sa.Column("glasses_drunk", sa.Integer(), nullable=True))
        batch_op.alter_column(
            "daily_goal",
            existing_type=sa.INTEGER(),
            nullable=True
        )
