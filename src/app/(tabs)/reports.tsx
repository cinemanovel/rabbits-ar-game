import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppScreen } from '@/components/AppScreen';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useAuth } from '@/features/auth/AuthProvider';
import { useFieldReports } from '@/features/fieldReports/useFieldReports';
import { colors, radii, spacing, typography } from '@/theme';

const TAB_BAR_CLEARANCE = 120;

function formatReportDate(createdAt: string) {
  const timestamp = new Date(createdAt);

  if (Number.isNaN(timestamp.getTime())) {
    return '--';
  }

  return timestamp.toISOString().slice(0, 10);
}

export default function ReportsTab() {
  const { user } = useAuth();
  const { error, isLoading, isSubmitting, reports, submit } = useFieldReports(user?.id);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [expandedReportIds, setExpandedReportIds] = useState<Record<string, boolean>>({});
  const hasInitializedExpandedReportsRef = useRef(false);

  const ownSubmittedReports = useMemo(
    () => reports.filter((report) => report.profile_id === user?.id && report.status !== 'private'),
    [reports, user?.id],
  );

  useEffect(() => {
    if (hasInitializedExpandedReportsRef.current) {
      return;
    }

    if (!ownSubmittedReports.length) {
      return;
    }

    const firstReport = ownSubmittedReports[0];

    if (!firstReport?.id) {
      return;
    }

    setExpandedReportIds({ [firstReport.id]: true });
    hasInitializedExpandedReportsRef.current = true;
  }, [ownSubmittedReports]);

  const handleSubmit = async () => {
    setSubmitMessage(null);

    const didSubmit = await submit({
      title,
      body,
    });

    if (didSubmit) {
      setTitle('');
      setBody('');
      setSubmitMessage('Field report submitted.');
    }
  };

  return (
    <AppScreen
      eyebrow="Field Report"
      title="Field Reports"
      description="Transmit observations back to the line."
      variant="scroll"
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
      >
        <View style={styles.composeCard}>
          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                maxLength={120}
                onChangeText={setTitle}
                placeholder="Optional subject line"
                placeholderTextColor={colors.textFaint}
                style={styles.input}
                value={title}
              />
              <Text style={styles.helper}>Optional. 1-120 characters.</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Report</Text>
              <TextInput
                maxLength={2000}
                multiline
                onChangeText={setBody}
                placeholder="Record what you observed."
                placeholderTextColor={colors.textFaint}
                style={[styles.input, styles.bodyInput]}
                value={body}
              />
              <Text style={styles.helper}>{body.length}/2000</Text>
            </View>

            {submitMessage ? <Text style={styles.success}>{submitMessage}</Text> : null}
            {!isLoading && error ? <Text style={styles.error}>{error}</Text> : null}

            <PrimaryButton
              disabled={isSubmitting}
              label={isSubmitting ? 'Submitting' : 'Submit report'}
              onPress={handleSubmit}
            />
          </View>
        </View>

        {reports.length > 0 ? (
          <View style={styles.traceCard}>
            <Text style={styles.traceEyebrow}>004773 // TRACE REGISTERED</Text>
            <Text style={styles.traceBody}>Your field report has been received.</Text>
            <Text style={styles.traceBody}>A pattern has attached itself to this case.</Text>
          </View>
        ) : null}

        <View style={styles.reportsCard}>
          <Text style={styles.listLabel}>Submitted</Text>
          {isLoading && ownSubmittedReports.length === 0 ? (
            <Text style={styles.stateCopy}>Scanning reports.</Text>
          ) : null}
          {!isLoading && error && ownSubmittedReports.length === 0 ? (
            <Text style={styles.stateCopy}>{error}</Text>
          ) : null}
          {!isLoading && !error && ownSubmittedReports.length === 0 ? (
            <Text style={styles.stateCopy}>No field reports submitted.</Text>
          ) : null}

          {ownSubmittedReports.map((report) => {
            const isExpanded = !!expandedReportIds[report.id];
            const reportTitle = report.title?.trim() ?? '';

            return (
              <View key={report.id} style={styles.row}>
                <View style={styles.rowMain}>
                  {reportTitle.length > 0 ? (
                    <Text style={styles.headline}>{reportTitle}</Text>
                  ) : null}
                  {isExpanded ? (
                    <Text style={styles.reportBody}>{report.body}</Text>
                  ) : null}
                </View>
                <View style={styles.rowAside}>
                  <Text style={styles.asideLabel}>Logged</Text>
                  <Text style={styles.asideValue}>{formatReportDate(report.created_at)}</Text>
                  <Pressable
                    hitSlop={8}
                    onPress={() => {
                      setExpandedReportIds((current) => {
                        const nextExpanded = !current[report.id];
                        return {
                          ...current,
                          [report.id]: nextExpanded,
                        };
                      });
                    }}
                    style={({ pressed }) => [pressed ? styles.rowPressed : null]}
                  >
                    <Text style={styles.reportActionText}>{isExpanded ? 'CLOSE' : 'VIEW'}</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </AppScreen>
  );
}

const cardBase = {
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: radii.lg,
  backgroundColor: colors.surfaceRaised,
  padding: spacing.lg,
  shadowColor: colors.black,
  shadowOffset: { width: 0, height: 20 },
  shadowOpacity: 0.24,
  shadowRadius: 30,
  elevation: 8,
} as const;

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: TAB_BAR_CLEARANCE + spacing.xl,
  },
  composeCard: {
    ...cardBase,
  },
  reportsCard: {
    ...cardBase,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  traceCard: {
    ...cardBase,
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  traceEyebrow: {
    color: colors.signal,
    fontSize: typography.micro,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  traceBody: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 22,
  },
  form: {
    gap: spacing.md,
  },
  field: {
    gap: spacing.xs,
  },
  label: {
    color: colors.signal,
    fontSize: typography.caption,
    fontWeight: '700',
    letterSpacing: 1.7,
    textTransform: 'uppercase',
  },
  input: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: typography.body,
    paddingHorizontal: spacing.md,
  },
  bodyInput: {
    minHeight: 120,
    paddingTop: spacing.md,
    textAlignVertical: 'top',
  },
  helper: {
    color: colors.textFaint,
    fontSize: typography.small,
    lineHeight: 20,
  },
  success: {
    color: colors.accent,
    fontSize: typography.small,
    lineHeight: 21,
  },
  error: {
    color: colors.signal,
    fontSize: typography.small,
    lineHeight: 21,
  },
  listLabel: {
    color: colors.signal,
    fontSize: typography.micro,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  stateCopy: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 22,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.lg,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  rowPressed: {
    opacity: 0.82,
  },
  rowMain: {
    flex: 1,
    flexShrink: 1,
    gap: spacing.xs,
  },
  headline: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
    letterSpacing: -0.2,
    lineHeight: 24,
  },
  reportBody: {
    color: colors.textMuted,
    fontSize: typography.small,
    lineHeight: 22,
  },
  rowAside: {
    flexShrink: 0,
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  asideLabel: {
    color: colors.textFaint,
    fontSize: typography.micro,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  asideValue: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '700',
    letterSpacing: 0.8,
    fontVariant: ['tabular-nums'],
  },
  reportActionText: {
    marginTop: spacing.sm,
    color: colors.text,
    fontSize: typography.micro,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
});
